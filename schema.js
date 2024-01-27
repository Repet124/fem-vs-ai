const E = 206000e4; // сталь
const A = 12e-4; // двутавр 10
const EA = E*A;
// const EA = 1;

export const nodes = [
	// x, y, ux, uy, Fx, Fy
	[0,	0,	undefined,	0,			undefined,	undefined],
	[3,	0,	undefined,	undefined,	undefined,	undefined],
	[3,	3,	undefined,	undefined,	undefined,	undefined],
	[6,	0,	0,			0,			undefined,	undefined],
];
export const bars = [
	[0,2,EA],
	[1,2,EA],
	[2,3,EA],
	[0,1,EA],
	[1,3,EA],
];
export const forces = [
	[0,0],
	[0,-8],
	[2,0],
	[0,0],
];

export default {
	nodes,
	bars,
	forces,
}