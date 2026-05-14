<style lang="scss">
	:global {
		@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

		:root {
			--color-primary: #BBC6E2;
			--color-secondary: #FFB86B;
			--background-primary: #031D34;
			--background-secondary: #FFB86B;
			--outline-primary: #45474D;
		}

		#app {
			width: 1280px;
			height: 1024px;
			color: var(--color-primary);
			font-family: 'Inter', sans-serif;
			font-size: 1rem;
		}

		h1, h2, h3, h4, h5, h6 {
			font-family: 'Hanken Grotesk', sans-serif;
		}
	}
</style>

<Sidebar />

<script lang="ts">
	import Sidebar from './Sidebar.svelte';
</script>