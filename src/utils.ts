import { Currency } from 'evm-lite-utils';

const keccak256 = require('js-sha3').keccak256;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const currencyFormatBOC = (amount: Currency) => {
	// console.log("amount:"+ amount)
	if(!amount) return '0 BOC';
	const b = amount.format('T');
	const l = b.split('.');

	if (l.length !== 2) {
		return l.join('.').replace('T', '  BOC');
	}

	if (l[1]) {
		l[1] = l[1].slice(0, 4)
	}

	const tAmout = l.join('.')
	if(tAmout.includes('T')) {
		return l.join('.').replace('T', '  BOC');
	}
	return tAmout + '  BOC';
};

export const isLetter = (str: string) => {
	return str.length === 1 && str.match(/[a-z]/i);
};

export const commaSeperate = (x: number | string) => {
	x = x.toString();

	const split = x.split('.');

	if (split.length > 1) {
		return `${split[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${
			split[1]
		}`;
	}

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const pubKeyToAddress = (pubkey: string) => {
	const pubKeyBuffer = Buffer.from(pubkey.slice(4, pubkey.length), 'hex');

	return Buffer.from(keccak256(pubKeyBuffer), 'hex')
		.slice(-20)
		.toString('hex');
};
