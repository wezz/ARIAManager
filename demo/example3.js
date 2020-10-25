document.addEventListener("DOMContentLoaded",function(){
	const example3Addmarkup = document.getElementById("example3-addmarkup");
	example3Addmarkup.addEventListener('click', () => {
		const example3Source = document.getElementById("example3-source");
		const example3dom = document.getElementById("example3dom");
		example3dom.innerHTML = example3Source.value;
	});

	const example3AddBindings = document.getElementById("example3-addbindings");
	example3AddBindings.addEventListener('click', () => {
		const example3 = document.getElementById("example3");
		window.dispatchEvent(new CustomEvent('global-markupchange', { detail: { target: example3 } }));
	});
});