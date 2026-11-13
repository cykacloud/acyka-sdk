<script lang="ts">
	/**
	 * Light, dark, or whatever the system says — one button that goes round.
	 *
	 * The choice is written where `app.html`'s first-paint script reads it, so
	 * the next page opens in it without a flash. "System" keeps listening: a Mac
	 * that turns dark at sunset takes the page with it.
	 */
	import IconSun from '@tabler/icons-svelte/icons/sun';
	import IconMoon from '@tabler/icons-svelte/icons/moon';
	import IconDeviceDesktop from '@tabler/icons-svelte/icons/device-desktop';

	type Mode = 'system' | 'light' | 'dark';
	const KEY = 'acyka:docs:theme';
	const NEXT: Record<Mode, Mode> = { system: 'light', light: 'dark', dark: 'system' };
	const SAID: Record<Mode, string> = {
		system: 'Theme: as the system. Switch to light',
		light: 'Theme: light. Switch to dark',
		dark: 'Theme: dark. Switch to the system’s'
	};

	// empty until the browser says, so the server's markup and the first render agree
	let mode = $state<Mode | ''>('');

	function apply(to: Mode) {
		const dark = to === 'dark' || (to === 'system' && !matchMedia('(prefers-color-scheme: light)').matches);
		document.documentElement.dataset.theme = dark ? 'dark' : 'light';
	}

	$effect(() => {
		let said: Mode = 'system';
		try {
			const stored = localStorage.getItem(KEY);
			if (stored === 'light' || stored === 'dark') said = stored;
		} catch {
			// site data is blocked: follow the system, which is what nothing means
		}
		mode = said;

		const media = matchMedia('(prefers-color-scheme: light)');
		const follow = () => {
			if (mode === 'system') apply('system');
		};
		media.addEventListener('change', follow);
		return () => media.removeEventListener('change', follow);
	});

	function turn() {
		const to = NEXT[mode || 'system'];
		mode = to;
		apply(to);
		try {
			localStorage.setItem(KEY, to);
		} catch {
			// as above
		}
	}
</script>

<button type="button" class="theme" onclick={turn} aria-label={SAID[mode || 'system']} title={SAID[mode || 'system']}>
	{#if mode === 'light'}
		<IconSun size={18} stroke={1.7} />
	{:else if mode === 'dark'}
		<IconMoon size={18} stroke={1.7} />
	{:else}
		<IconDeviceDesktop size={18} stroke={1.7} />
	{/if}
</button>

<style>
	.theme {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--control-h);
		height: var(--control-h);
		border: 0;
		border-radius: var(--r-control);
		background: transparent;
		color: var(--text-2);
		cursor: pointer;
	}

	.theme:hover {
		background: var(--surface-2);
		color: var(--text);
	}
</style>
