<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let dialogOpen = $state(false);
	let potatoName = $state('');
	let isLoading = $state(false);
	let generatedResponse = $state('');
	let error = $state('');

	function closeDialog() {
		dialogOpen = false;
		potatoName = '';
		generatedResponse = '';
		error = '';
	}

	async function generatePotato() {
		if (!potatoName.trim()) return;

		isLoading = true;
		error = '';
		generatedResponse = '';

		try {
			const response = await fetch('/api/generate-potato', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ potatoName: potatoName.trim() })
			});

			const data = await response.json();

			if (data.success) {
				generatedResponse = data.response;
			} else {
				error = data.error || 'Failed to generate potato';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen w-full flex-col items-center pt-8">
	<img src="/image/potato.png" alt="Potato" class="w-1/4" />
	<div class="mt-8 flex flex-col items-center gap-6">
		<h1 class="text-center text-3xl font-bold font-sans">
			Welcome to the potato fan club!<br />
			We'd love to see an image of your favourite potato!<br />
			Use our potato generator below.
		</h1>
		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Trigger class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-3 text-lg">
				Generate Potato
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Generate Your Potato</Dialog.Title>
					<Dialog.Description>
						Enter a name for your potato and we'll generate a unique image for you!
					</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="potato-name" class="text-right">Name</Label>
						<Input
							id="potato-name"
							bind:value={potatoName}
							placeholder="Your Potato's Name"
							class="col-span-3"
							disabled={isLoading}
						/>
					</div>

					{#if error}
						<div class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
							{error}
						</div>
					{/if}

					{#if generatedResponse}
						<div class="text-green-800 text-sm bg-green-50 p-3 rounded-md max-h-32 overflow-y-auto">
							<strong>Generated Potato Description:</strong><br />
							{generatedResponse}
						</div>
					{/if}

					{#if isLoading}
						<div class="text-blue-600 text-sm bg-blue-50 p-3 rounded-md flex items-center gap-2">
							<div class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
							Generating your potato...
						</div>
					{/if}
				</div>
				<Dialog.Footer>
					<Button variant="outline" onclick={closeDialog} disabled={isLoading}>Cancel</Button>
					<Button variant="default" onclick={generatePotato} disabled={!potatoName.trim() || isLoading}>
						{isLoading ? 'Generating...' : 'Generate Your Potato'}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
