module.exports = function (rA, rB, isWin, K = 32) {
    //Ra:A玩家当前的积分
	//Rb:B玩家当前的积分
	//Sa:实际胜负值
	//Ea:预期A选手胜负值
	let Ea = 1/(1+Math.pow(10,[(rB-rA)/400]));
	let Sa,R;

	if(rA>1400&&rA<1900) {
		K = 20;
	} else if(rA>=1900) {
		K = 16;
	} else {
		K = 32;
	}

	if(isWin === 1) {
		Sa = 1;
		R = K*(Sa-Ea);
	} else if(isWin === -1) {
		Sa = 0;
		R = K*(Sa-Ea);
	} else {
		Sa = 0.5;
		R = K*(Sa-Ea);
	}

	return Math.round(R);  //该增减的分数，整数
};