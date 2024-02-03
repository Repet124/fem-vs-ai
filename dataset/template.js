const EA = 1;
const nodes = [
	// x, y, ux, uy
	[0,	0,	undefined,	0],
	[3,	0,	undefined,	undefined],
	[3,	3,	undefined,	undefined],
	[6,	0,	0,			0],
];
const bars = [
	[0,2,EA, undefined],
	[1,2,EA, undefined],
	[2,3,EA, undefined],
	[0,1,EA, undefined],
	[1,3,EA, undefined],
];
const forces = [
	[0,0],
	[0,-8],
	[-3,0],
	[0,0],
];

module.exports = {
	nodes,
	bars,
	forces,
}