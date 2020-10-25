document.addEventListener("DOMContentLoaded",function(){
	const example4 = document.getElementById("example4");
	const exampletarget4 = document.getElementById("exampletarget4");

	const ARIAManagerExample4Instance = new window.ARIAManager.default(example4);
	
	const example4buttonopen = document.getElementById("example4-openbutton");
	example4buttonopen.addEventListener('click', () => {
		ARIAManagerExample4Instance.AriaHidden(exampletarget4, false);
	});

	const example4buttonclose= document.getElementById("example4-closebutton");
	example4buttonclose.addEventListener('click', () => {
		ARIAManagerExample4Instance.AriaHidden(exampletarget4, true);
	});
});