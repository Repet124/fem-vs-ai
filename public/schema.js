const E = 206000e4; // сталь
const A = 12e-4; // двутавр 10
// const EA = E*A;
const EA = 1;

export const nodes = [
	// x, y, ux, uy
	[0,	0,	undefined,	0],
	[3,	0,	undefined,	undefined],
	[3,	3,	undefined,	undefined],
	[6,	0,	0,			0],
];
export const bars = [
	[0,2,EA, undefined],
	[1,2,EA, undefined],
	[2,3,EA, undefined],
	[0,1,EA, undefined],
	[1,3,EA, undefined],
];
export const forces = [
	[0,0],
	[0,8],
	[-3,0],
	[0,0],
];

export default {
	nodes,
	bars,
	forces,
}