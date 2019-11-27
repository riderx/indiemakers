
export class mention {
	TT: any;
	MultiToken: any;
	S_START: any;
	S_HASH: any;
	S_HASHTAG: any;
	v: any;
	_linkify$parser: any;
	MT: any;
	State: any;
	TT_DOMAIN: any;
	TT_LOCALHOST: any;
	TT_NUM: any;
	TT_SLASH: any;
	TT_TLD: any;
	TT_UNDERSCORE: any;
	TT_DOT: any;
	TT_AT: any;
	S_AT: any;
	S_AT_SYMS: any;
	S_MENTION: any;
	S_MENTION_DIVIDER: any;
	S_MENTION_DIVIDER_SYMS: any;
	constructor(linkify: any) {
		this.TT = linkify.scanner.TOKENS; // Text tokens
		this._linkify$parser = linkify.parser;
		this.MT = this._linkify$parser.TOKENS;
		this.State = this._linkify$parser.State; // Multi tokens, state

		this.MultiToken = this.MT.Base;
		this.S_START = linkify.parser.start;

		this.TT_DOMAIN = this.TT.DOMAIN;
		this.TT_LOCALHOST = this.TT.LOCALHOST;
		this.TT_NUM = this.TT.NUM;
		this.TT_SLASH = this.TT.SLASH;
		this.TT_TLD = this.TT.TLD;
		this.TT_UNDERSCORE = this.TT.UNDERSCORE;
		this.TT_DOT = this.TT.DOT;
		this.TT_AT = this.TT.AT;

		linkify.inherits(this.MultiToken, this.MENTION, {
			type: 'mention',
			isLink: true,
			toHref: function toHref() {
				return '/' + this.toString().substr(1);
			}
		});

		this.S_AT = this.S_START.jump(this.TT.AT); // @
		this.S_AT_SYMS = new this.State();
		this.S_MENTION = new this.State(this.MENTION);
		this.S_MENTION_DIVIDER = new this.State();
		this.S_MENTION_DIVIDER_SYMS = new this.State();

		// @_,
		this.S_AT.on(this.TT_UNDERSCORE, this.S_AT_SYMS);

		//  @_*
		this.S_AT_SYMS.on(this.TT_UNDERSCORE, this.S_AT_SYMS).on(this.TT_DOT, this.S_AT_SYMS);

		// Valid mention (not made up entirely of symbols)
		this.S_AT.on(this.TT_DOMAIN, this.S_MENTION).on(this.TT_LOCALHOST, this.S_MENTION).on(this.TT_TLD, this.S_MENTION).on(this.TT_NUM, this.S_MENTION);

		this.S_AT_SYMS.on(this.TT_DOMAIN, this.S_MENTION).on(this.TT_LOCALHOST, this.S_MENTION).on(this.TT_TLD, this.S_MENTION).on(this.TT_NUM, this.S_MENTION);

		// More valid mentions
		this.S_MENTION.on(this.TT_DOMAIN, this.S_MENTION).on(this.TT_LOCALHOST, this.S_MENTION).on(this.TT_TLD, this.S_MENTION).on(this.TT_NUM, this.S_MENTION).on(this.TT_UNDERSCORE, this.S_MENTION);

		// Mention with a divider
		this.S_MENTION.on(this.TT_SLASH, this.S_MENTION_DIVIDER).on(this.TT_DOT, this.S_MENTION_DIVIDER).on(this.TT_AT, this.S_MENTION_DIVIDER);

		// Mention _ trailing stash plus syms
		this.S_MENTION_DIVIDER.on(this.TT_UNDERSCORE, this.S_MENTION_DIVIDER_SYMS);
		this.S_MENTION_DIVIDER_SYMS.on(this.TT_UNDERSCORE, this.S_MENTION_DIVIDER_SYMS);

		// Once we get a word token, mentions can start up again
		this.S_MENTION_DIVIDER.on(this.TT_DOMAIN, this.S_MENTION).on(this.TT_LOCALHOST, this.S_MENTION).on(this.TT_TLD, this.S_MENTION).on(this.TT_NUM, this.S_MENTION);

		this.S_MENTION_DIVIDER_SYMS.on(this.TT_DOMAIN, this.S_MENTION).on(this.TT_LOCALHOST, this.S_MENTION).on(this.TT_TLD, this.S_MENTION).on(this.TT_NUM, this.S_MENTION);

	}
	MENTION = (value: any) => {
		this.v = value;
	}
}
