import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Safely extract the first base64 image from a Responses API result.
 * The image_generation tool returns items whose content includes { type: 'output_image', image_base64: '...' }.
 */
function extractFirstImageBase64(response: any): string | null {
  const items = response?.output ?? [];
  for (const item of items) {
    const content = item?.content ?? [];
    for (const c of content) {
      if (c?.type === 'output_image' && typeof c?.image_base64 === 'string' && c.image_base64.length > 0) {
        return c.image_base64;
      }
    }
  }
  return null;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { potatoName } = await request.json();

    if (!potatoName || typeof potatoName !== 'string') {
      return json({ error: 'Potato name is required' }, { status: 400 });
    }

    const resp = await client.responses.create({
      model: 'gpt-4.1',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text:
                'Your job is to generate an image of a variant of an animated potato based on the attached base potato image and a descriptive text describing a different version of this potato to generate. It should keep the original potato identity and style.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Please generate me a potato based on the following name: ${potatoName}. This should be based on the same style as the image provided. Make it look like the same potato, simply a different version.`
            },
            {
              type: 'input_image',
              image_url: 'https://www.potatofanclub.com/image/potato.png'
            }
          ]
        }
      ],
      // expose and force the hosted image tool
      tools: [{ type: 'image_generation' }],
      tool_choice: 'required'

      // Optional: if you want stronger style preservation from the input image,
      // you can add tool config in the prompt/instructions (supported by the image tool),
      // e.g., “Use high input fidelity” or pass a model-supported parameter when available.
    });

    const imgB64 = extractFirstImageBase64(resp);
    if (!imgB64) {
      return json({ error: 'No image returned by the image_generation tool' }, { status: 502 });
    }

    // easiest way for the UI: a data URL you can bind directly to <img src="...">
    const imageDataUrl = `data:image/png;base64,${imgB64}`;

    return json({
      success: true,
      imageDataUrl
      // If you prefer raw base64: imageBase64: imgB64
    });
  } catch (err) {
    console.error('OpenAI API error:', err);
    return json({ error: 'Failed to generate potato' }, { status: 500 });
  }
};
