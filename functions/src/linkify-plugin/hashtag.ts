
export class hashtag {
	TT: any; // Text tokens
	MultiToken: any; // Base Multi token class
	S_START: any;
	v: any;
	S_HASH: any;
	S_HASHTAG: any;
	constructor(linkify: any) {
		this.TT = linkify.scanner.TOKENS; // Text tokens
		this.MultiToken = linkify.parser.TOKENS.Base; // Base Multi token class
		this.S_START = linkify.parser.start;
		linkify.inherits(this.MultiToken, this.HASHTAG, {
			type: 'hashtag',
			isLink: true
		});

		this.S_HASH = this.S_START.jump(this.TT.POUND);
		this.S_HASHTAG = new linkify.parser.State(this.HASHTAG);

		this.S_HASH.on(this.TT.DOMAIN, this.S_HASHTAG);
		this.S_HASH.on(this.TT.TLD, this.S_HASHTAG);
		this.S_HASH.on(this.TT.LOCALHOST, this.S_HASHTAG);
	}
	HASHTAG = (value: any) => {
		this.v = value;
	}
}