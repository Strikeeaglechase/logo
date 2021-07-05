const width = 676;
const height = 676;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let baseLogo: HTMLImageElement = new Image(width, height);
async function init() {
	console.log("Init started");
	canvas = document.getElementById("canvas") as HTMLCanvasElement;
	ctx = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;
	baseLogo.src = "logo.png";
	await new Promise(res => baseLogo.onload = res);
	console.log("Image loaded");
	update();
	translate.forEach((col, idx) => createSelector(idx));
	document.getElementById("save").addEventListener("click", () => {
		var link = document.createElement('a');
		link.download = `logo.png`;
		link.href = canvas.toDataURL()
		link.click();
	})
}
function createSelector(idx: number) {
	const section = document.getElementById("inputs");
	const selector = document.createElement("input");
	selector.type = "color";
	selector.id = `select-${idx}`;
	let last = "";
	setInterval(() => {
		if (selector.value != last) {
			const r = selector.value.substring(1, 3);
			const g = selector.value.substring(3, 5);
			const b = selector.value.substring(5, 7);
			translate[idx] = {
				r: parseInt(r, 16),
				g: parseInt(g, 16),
				b: parseInt(b, 16)
			}
			last = selector.value;
			update();
		}
	}, 16);
	const col = translate[idx];
	selector.value = '#' + col.r.toString(16) + col.g.toString(16) + col.b.toString(16);
	// selector.addEventListener("change", (e) => console.log(selector.value));

	section.appendChild(selector);
}
interface Pixel {
	r: number;
	b: number;
	g: number;
}
const maxDist = 150;
const targets: Pixel[] = [
	{ r: 227, g: 227, b: 227 },
	{ r: 46, g: 46, b: 46 },
	{ r: 39, g: 161, b: 205 },
	{ r: 31, g: 126, b: 160 },
];
const translate: Pixel[] = [
	{ r: 227, g: 227, b: 227 },
	{ r: 46, g: 46, b: 46 },
	{ r: 39, g: 161, b: 205 },
	{ r: 31, g: 126, b: 160 },
];
function processPix(pixel: Pixel): Pixel {
	let bestPix = { r: 0, g: 0, b: 0 };
	let bestVal = Infinity;
	targets.forEach((target, idx) => {
		const dist = Math.abs(target.r - pixel.r)
			+ Math.abs(target.g - pixel.g)
			+ Math.abs(target.b - pixel.b)
		if (dist < maxDist && dist < bestVal) {
			// bestPix = target;
			bestPix = translate[idx];
			bestVal = dist;
		}
	});
	return bestPix;
}
const pixs = {};
function update() {
	ctx.drawImage(baseLogo, 0, 0);
	const imageData = ctx.getImageData(0, 0, width, height);
	const { data } = imageData
	const newData: number[] = [];
	for (let i = 0; i < data.length; i += 4) {
		if (data[i + 3] == 0) {
			newData[i + 0] = 0;
			newData[i + 1] = 0;
			newData[i + 2] = 0;
			newData[i + 3] = 0;
		} else {
			const pixel = {
				r: data[i + 0],
				g: data[i + 1],
				b: data[i + 2]
			}
			const newPix = processPix(pixel);
			newData[i + 0] = newPix.r;
			newData[i + 1] = newPix.g;
			newData[i + 2] = newPix.b;
			newData[i + 3] = 255;

			const name = `R: ${pixel.r} G: ${pixel.g} B: ${pixel.b}`;
			if (!pixs[name]) pixs[name] = 0;
			pixs[name]++;

		}
	}
	// const items = Object.keys(pixs).map(key => {
	// 	return { name: key, value: pixs[key] }
	// });
	// console.log(items.sort((a, b) => a.value - b.value));

	const nd = new ImageData(new Uint8ClampedArray(newData), width, height);
	ctx.putImageData(nd, 0, 0);
}
window.onload = init;