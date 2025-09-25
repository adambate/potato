<script lang="ts">
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Menu from 'lucide-svelte/icons/menu';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Avatar from '$lib/components/ui/avatar';

	let { children, data } = $props();

	type NavItem = {
		url: string;
		label: string;
		perm?: string;
	};

	const PARTNER_NAV: NavItem[] = [{ url: '/dashboard', label: 'Dashboard' }];
	const TEAM_NAV: NavItem[] = [
		{ url: '/dashboard', label: 'Dashboard' },
		{ url: '/team/tool', label: 'Tools' },
	];
	const TOP_NAV = data.permissions.has('team:access')
		? TEAM_NAV.filter((x) => !x.perm || data.permissions.has(x.perm))
		: PARTNER_NAV;
	function logout() {
		goto(`/api/auth/logout`);
	}
</script>

<Toaster />
<div class={[`flex min-h-[100dvh] w-full flex-col`, page.data.fixedHeight && `h-[100dvh]`]}>
	<header
		class="bg-primary sticky top-0 z-20 flex h-16 flex-none items-center gap-4 border-b px-4 md:px-6"
	>
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a
				href="https://seobrothers.com"
				class="flex shrink-0 items-center gap-2 text-lg font-semibold md:text-base"
			>
				<img src="/favicon.svg" alt="logo" class="block size-8 shrink-0" />
				<span class="sr-only">SEO Brothers</span>
			</a>
			{#each TOP_NAV as link (link.url)}
				<a
					href={link.url}
					class="{data.path.startsWith(link.url)
						? `text-foreground`
						: `text-primary-foreground`} hover:text-foreground transition-colors"
				>
					{link.label}
				</a>
			{/each}
		</nav>
		<Sheet.Root>
			<Sheet.Trigger
				class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), `shrink-0 md:hidden`)}
			>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a href="https://seobrothers.com" class="flex items-center gap-2 text-lg font-semibold">
						<img src="/favicon.svg" alt="logo" class="size-6" />
						<span class="sr-only">SEO Brothers</span>
					</a>
					{#each TOP_NAV as link (link.url)}
						<a
							href={link.url}
							class="{data.path.startsWith(link.url)
								? ``
								: `text-muted-foreground`} hover:text-foreground">{link.label}</a
						>
					{/each}
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="ml-auto size-10 rounded-full">
					<Avatar.Root>
						<Avatar.Fallback>
							{#if data.initials}
								{data.initials}
							{:else}
								<CircleUser class="h-5 w-5" />
							{/if}
						</Avatar.Fallback>
						<Avatar.Image src={data.avatar} alt="User gravatar" />
					</Avatar.Root>
					<span class="sr-only">Toggle user menu</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>{data.user?.given_name} {data.user?.family_name}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={logout}>Sign out</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		{@render children()}
	</main>
</div>
