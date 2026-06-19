// Copyright (C) 2026  Ruben Giuriato - Licensed under GNU GPLv3

import './scss/normalize.scss';
import { mount } from "svelte";
import App from './components/App.svelte';

const app = mount(App, {
	target: document.getElementById('app')
});

export default app;