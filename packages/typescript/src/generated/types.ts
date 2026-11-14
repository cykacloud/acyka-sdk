// Generated from openapi.json by tools/generate.ts. Do not edit.

/**
 * The envelope every collection answers in.
 *
 * `total` is there when the caller pages by offset and therefore has to know
 * how far the list goes; a cursor-paged list leaves it out rather than paying
 * for a second count nobody reads.
 */
export type Page<T> = {
	items: T[];
	total?: number;
};

/**
 * A post's id, on the wire as a string and in the database as a bigint.
 *
 * Its own type rather than a `String` field, so the conversion happens in one
 * place and a query that forgets it does not compile. JSON has one number type
 * and it is a double; ids near 2^53 are exactly where that stops being an
 * academic point, and a client that silently rounds one reads and edits the
 * wrong row.
 */
export type PostId = string;

/**
 * One episode, on one day.
 */
export type Airing = {
	id: number;
	title: string;
	title_orig?: string;
	poster?: string;
	/** which episode this is, projected: an ongoing series airs weekly, so episode *n* lands seven times *n − 1* days after the first */
	episode: number;
	/** `YYYY-MM-DD`, UTC. A date and not a timestamp: nothing here knows the hour an episode lands, and inventing one would be a lie with a clock on it. */
	on: string;
	/** whether a dub for it is already playable here, or it is still projected */
	out: boolean;
};

/**
 * A title a character appears in, and what they are in it.
 */
export type Appearance = {
	id: number;
	title: string;
	title_orig?: string;
	poster?: string;
	year?: number;
	/** `tv` | `movie` | `ova` | `ona` | `special` | `music` */
	kind: string;
	episodes: number;
	/** The one number a reader sees: what the people here think of it and what the outside number said, weighed against each other. */
	score?: number;
	roles: string[];
};

/**
 * A character, as its own page.
 */
export type Character = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	/** how many titles carry them */
	titles: number;
};

export type CharacterCard = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
};

/**
 * The preview frames one episode has.
 */
export type Episode = {
	episode: number;
	shots: string[];
};

export type EpisodeBody = {
	episode: number;
	rewatching?: boolean;
};

/**
 * A folder: a status somebody keeps titles under, or a shelf they named.
 *
 * The five status categories are exclusive — a title sits in at most one of an
 * account's `watching`, `planned`, `done`, `paused` and `dropped` folders —
 * and `other` folders hold whatever they like.
 */
export type Folder = {
	code: string;
	/** null: the category's own name, in whatever language the reader uses */
	name?: string;
	/** `watching` | `planned` | `done` | `paused` | `dropped` | `other` */
	category: string;
	/** `#RRGGBB` */
	color: string;
	about: string;
	cover?: string;
	public: boolean;
	count: number;
	/** the account it belongs to, by its current name */
	owner: string;
	/** the three newest posters in it */
	posters: string[];
	at: string;
	edited: string;
};

export type FolderBody = {
	/** leave out for the category's own name */
	name?: string;
	/** `#rrggbb`; leave out for the category's colour */
	color?: string;
	/** `watching` | `planned` | `done` | `paused` | `dropped` | `other` */
	category: string;
};

export type FolderItem = {
	shikimori_id: number;
	title: string;
	poster?: string;
	/** what its authors wrote beside it */
	note: string;
	/** the group it sits in, if the folder has any */
	group_id?: number;
	position: number;
	at: string;
};

export type FolderPatch = {
	/** `""` gives the folder its category's name back */
	name?: string;
	about?: string;
	color?: string;
	public?: boolean;
};

export type ItemBody = {
	note?: string;
};

/**
 * An account, as its own token sees it.
 *
 * Field for field what `/oauth2/userinfo` would say, in this door's casing,
 * plus the things a claim set has no room for. It exists beside userinfo
 * rather than instead of it because userinfo's shape is fixed by a spec and
 * this one is ours to grow.
 */
export type Me = {
	/** A string, and never a number. It is an `id_token`'s `sub` on the other door and a JSON number loses precision in a language that has only doubles — which is most of them, including the one most of these clients are written in. */
	id: string;
	nickname?: string;
	avatar?: string;
	banner?: string;
	bio?: string;
	verified?: boolean;
	created_at?: string;
	email?: string;
	email_verified?: boolean;
};

/**
 * Somebody, as small as a person gets on this door.
 *
 * The site draws a person with `Name` or `Identity` and hands those components
 * a whole `Wearer` — the colour, the badges, the pattern, the presence. None
 * of that is here, and leaving it out is the decision rather than an omission:
 * a badge is a thing this site invented and may re-invent, and a client that
 * has built a row around `worn.hue` is a client we would have to keep it for.
 */
export type Person = {
	nickname: string;
	avatar?: string;
	verified: boolean;
};

export type PersonCard = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	/** What this person is. All three can be false — most of a crew is none of them — and several can be true at once. */
	seyu: boolean;
	mangaka: boolean;
	producer: boolean;
};

/**
 * A person, as their own page.
 */
export type PersonPage = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	/** What this person is. All three can be false — most of a crew is none of them — and several can be true at once. */
	seyu: boolean;
	mangaka: boolean;
	producer: boolean;
	japanese?: string;
	website?: string;
	titles: number;
	roles: number;
};

export type Post = {
	/** A string for the reason [`Me::id`] is one. */
	id: PostId;
	body: string;
	shikimori_id?: number;
	title?: string;
	episode?: number;
	parent?: PostId;
	at: string;
};

export type PostBody = {
	body: string;
	shikimori_id?: number;
	title?: string;
	episode?: number;
	/** Read and ignored. A post used to be able to hide behind one flag; `||a phrase||` in the body does that properly and this door is a contract somebody else's code already sends. Refusing the field would break a client over a word that no longer means anything, so it is accepted and dropped. */
	spoiler?: boolean;
	parent?: PostId;
};

/**
 * A public profile.
 *
 * Narrower than the site's own, on purpose, and narrower in one direction: the
 * counts an account keeps to itself are **absent** here exactly as they are
 * there, because that decision is made in `social::profile_of`'s query and not
 * by whoever is formatting the answer. Copying the numbers out is safe; asking
 * for them a second way would not be.
 */
export type Profile = {
	id: string;
	nickname: string;
	avatar?: string;
	banner?: string;
	bio?: string;
	about?: string;
	verified: boolean;
	/** `user` | `mod` | `admin` */
	role: string;
	/** The other names this account answers to, in the order they arranged them. */
	also?: string[];
	followers?: number;
	following?: number;
	titles?: number;
	episodes?: number;
	joined_at: string;
};

/**
 * How far through a title somebody is. It belongs to the title, not to a
 * folder: taking a title out of every folder keeps it.
 */
export type Progress = {
	shikimori_id: number;
	/** the status folder it is in, if any: `watching` | `planned` | `done` | `paused` | `dropped` */
	status?: string;
	episode: number;
	/** absent where the catalogue does not know, which is "no ceiling", not "none" */
	episodes?: number;
	rewatching: boolean;
	/** 1-10; null for a title they have not judged */
	score?: number;
	at: string;
};

/**
 * Every refusal on this door, in the one shape they all take.
 *
 * `message` is a **phrase name and never a sentence**: one room can hold five
 * languages at once, so the server does not get to choose which one an error
 * is read in. A client shows its own words for the names it knows and the name
 * itself for the ones it does not — which is also why the list of them is
 * stable enough to generate a typed error per name in six languages.
 */
export type Refusal = {
	/** e.g. `errors.oauthInsufficientScope` */
	message: string;
	/** Extra fields a refusal owes a reason for, merged in beside `message` — the scope that was missing, how long a ban has left. Absent for most. */
	detail?: unknown;
};

/**
 * A franchise entry: a card, plus where in the sequence the caller was.
 */
export type Related = {
	id: number;
	title: string;
	title_orig?: string;
	poster?: string;
	year?: number;
	/** `tv` | `movie` | `ova` | `ona` | `special` | `music` */
	kind: string;
	episodes: number;
	/** The one number a reader sees: what the people here think of it and what the outside number said, weighed against each other. */
	score?: number;
	/** whether this row *is* the title that was asked about */
	current: boolean;
};

export type ScoreBody = {
	/** 1 to 10 */
	score: number;
};

/**
 * What somebody's watching adds up to.
 */
export type Stats = {
	planned: number;
	watching: number;
	rewatching: number;
	paused: number;
	done: number;
	dropped: number;
	episodes: number;
	minutes: number;
	rated: number;
	average?: number;
};

/**
 * A title, as its own page.
 *
 * `wash` is on the site's shape and is not on this one. It is the colour a
 * page tints itself with, computed from the artwork on first read — a fact
 * about how this site draws a screen rather than a fact about the title, and
 * putting it in a frozen contract would be promising a stranger the house's
 * paint.
 */
export type Title = {
	id: number;
	title: string;
	title_orig?: string;
	poster?: string;
	description?: string;
	genres: string[];
	studios: string[];
	kind: string;
	/** `ongoing` | `released` | `announced` */
	status: string;
	episodes: number;
	duration?: number;
	score?: number;
	/** And the two halves of that one number, for a caller with room to say so. */
	our_score?: number;
	our_votes: number;
	year?: number;
	rating?: string;
	screenshots: string[];
};

/**
 * A title as it appears in a list.
 *
 * `id` is the shikimori id and is the only key this catalogue has ever had. It
 * is a number here rather than a string, unlike the ids above: these are five
 * and six digits and always will be, since they are somebody else's sequence
 * and not ours to outgrow.
 */
export type TitleCard = {
	id: number;
	title: string;
	title_orig?: string;
	poster?: string;
	year?: number;
	/** `tv` | `movie` | `ova` | `ona` | `special` | `music` */
	kind: string;
	episodes: number;
	/** The one number a reader sees: what the people here think of it and what the outside number said, weighed against each other. */
	score?: number;
};

/**
 * One character in one title.
 */
export type TitleCharacter = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	/** `Main` or `Supporting`, as the source words it */
	roles: string[];
	voices?: Voice[];
};

/**
 * One person on one title, and what they did on it.
 */
export type TitleStaff = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	/** What this person is. All three can be false — most of a crew is none of them — and several can be true at once. */
	seyu: boolean;
	mangaka: boolean;
	producer: boolean;
	roles: string[];
};

/**
 * Somebody who said the lines, and the language they said them in.
 *
 * **`language` absent means nobody has said, which is not the same as "not
 * japanese".** The pass that fills it asks AniList for the japanese cast,
 * which can confirm a voice and can never rule one out. A client that reads
 * this as a boolean will label a chinese dub actress as the original.
 */
export type Voice = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	/** What this person is. All three can be false — most of a crew is none of them — and several can be true at once. */
	seyu: boolean;
	mangaka: boolean;
	producer: boolean;
	/** a BCP-47 tag — `ja` for the original, and the only one written so far */
	language?: string;
};

/**
 * A character somebody voiced, and where.
 */
export type VoicedRole = {
	id: number;
	name: string;
	name_orig?: string;
	poster?: string;
	title: TitleCard;
	roles: string[];
};

/** Every scope this api offers. */
export type Scope =
	| 'catalog:read'
	| 'email'
	| 'lists:read'
	| 'lists:write'
	| 'offline_access'
	| 'openid'
	| 'people:read'
	| 'profile'
	| 'social:read'
	| 'social:write';

export const SCOPES: readonly Scope[] = [
	'catalog:read',
	'email',
	'lists:read',
	'lists:write',
	'offline_access',
	'openid',
	'people:read',
	'profile',
	'social:read',
	'social:write',
] as const;
