//! Generated from openapi.json by tools/generate.ts. Do not edit.

use serde::{Deserialize, Serialize};

/// The envelope every collection answers in.
///
/// `total` is there when the caller pages by offset and therefore has to know
/// how far the list goes; a cursor-paged list leaves it out rather than paying
/// for a second count nobody reads.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Page<T> {
    pub items: Vec<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub total: Option<i64>,
}

impl<T> Page<T> {
    pub fn len(&self) -> usize {
        self.items.len()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

impl<T> IntoIterator for Page<T> {
    type Item = T;
    type IntoIter = std::vec::IntoIter<T>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}

/// A post's id, on the wire as a string and in the database as a bigint.
///
/// Its own type rather than a `String` field, so the conversion happens in one
/// place and a query that forgets it does not compile. JSON has one number type
/// and it is a double; ids near 2^53 are exactly where that stops being an
/// academic point, and a client that silently rounds one reads and edits the
/// wrong row.
pub type PostId = String;

/// One episode, on one day.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Airing {
    pub id: i64,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// which episode this is, projected: an ongoing series airs weekly, so episode
    /// *n* lands seven times *n − 1* days after the first
    pub episode: i32,
    /// `YYYY-MM-DD`, UTC. A date and not a timestamp: nothing here knows the hour
    /// an episode lands, and inventing one would be a lie with a clock on it.
    pub on: String,
    /// whether a dub for it is already playable here, or it is still projected
    pub out: bool,
}

/// A title a character appears in, and what they are in it.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Appearance {
    pub id: i64,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub year: Option<i32>,
    /// `tv` | `movie` | `ova` | `ona` | `special` | `music`
    pub kind: String,
    pub episodes: i32,
    /// The one number a reader sees: what the people here think of it and what the
    /// outside number said, weighed against each other.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub score: Option<f64>,
    pub roles: Vec<String>,
}

/// A character, as its own page.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Character {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// how many titles carry them
    pub titles: i64,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct CharacterCard {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
}

/// The preview frames one episode has.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Episode {
    pub episode: i32,
    pub shots: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Default)]
pub struct EpisodeBody {
    pub episode: i32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rewatching: Option<bool>,
}

impl EpisodeBody {
    pub fn new(episode: impl Into<i32>) -> Self {
        Self {
            episode: episode.into(),
            ..Default::default()
        }
    }

    pub fn rewatching(mut self, value: impl Into<bool>) -> Self {
        self.rewatching = Some(value.into());
        self
    }
}

/// A folder: a status somebody keeps titles under, or a shelf they named.
///
/// The five status categories are exclusive — a title sits in at most one of an
/// account's `watching`, `planned`, `done`, `paused` and `dropped` folders —
/// and `other` folders hold whatever they like.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Folder {
    pub code: String,
    /// null: the category's own name, in whatever language the reader uses
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    /// `watching` | `planned` | `done` | `paused` | `dropped` | `other`
    pub category: String,
    /// `#RRGGBB`
    pub color: String,
    pub about: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover: Option<String>,
    pub public: bool,
    pub count: i64,
    /// the account it belongs to, by its current name
    pub owner: String,
    /// the three newest posters in it
    pub posters: Vec<String>,
    pub at: String,
    pub edited: String,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Default)]
pub struct FolderBody {
    /// leave out for the category's own name
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    /// `#rrggbb`; leave out for the category's colour
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
    /// `watching` | `planned` | `done` | `paused` | `dropped` | `other`
    pub category: String,
}

impl FolderBody {
    pub fn new(category: impl Into<String>) -> Self {
        Self {
            category: category.into(),
            ..Default::default()
        }
    }

    /// leave out for the category's own name
    pub fn name(mut self, value: impl Into<String>) -> Self {
        self.name = Some(value.into());
        self
    }

    /// `#rrggbb`; leave out for the category's colour
    pub fn color(mut self, value: impl Into<String>) -> Self {
        self.color = Some(value.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct FolderItem {
    pub shikimori_id: i32,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// what its authors wrote beside it
    pub note: String,
    /// the group it sits in, if the folder has any
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_id: Option<i64>,
    pub position: i32,
    pub at: String,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct FolderPatch {
    /// `""` gives the folder its category's name back
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub about: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub public: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Default)]
pub struct ItemBody {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,
}

impl ItemBody {
    pub fn new() -> Self {
        Self {
            ..Default::default()
        }
    }

    pub fn note(mut self, value: impl Into<String>) -> Self {
        self.note = Some(value.into());
        self
    }
}

/// An account, as its own token sees it.
///
/// Field for field what `/oauth2/userinfo` would say, in this door's casing,
/// plus the things a claim set has no room for. It exists beside userinfo
/// rather than instead of it because userinfo's shape is fixed by a spec and
/// this one is ours to grow.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Me {
    /// A string, and never a number.
    ///
    /// It is an `id_token`'s `sub` on the other door and a JSON number loses
    /// precision in a language that has only doubles — which is most of them,
    /// including the one most of these clients are written in.
    pub id: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nickname: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub banner: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verified: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub email_verified: Option<bool>,
}

/// Somebody, as small as a person gets on this door.
///
/// The site draws a person with `Name` or `Identity` and hands those components
/// a whole `Wearer` — the colour, the badges, the pattern, the presence. None
/// of that is here, and leaving it out is the decision rather than an omission:
/// a badge is a thing this site invented and may re-invent, and a client that
/// has built a row around `worn.hue` is a client we would have to keep it for.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Person {
    pub nickname: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar: Option<String>,
    pub verified: bool,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct PersonCard {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// What this person is. All three can be false — most of a crew is none of them
    /// — and several can be true at once.
    pub seyu: bool,
    pub mangaka: bool,
    pub producer: bool,
}

/// A person, as their own page.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct PersonPage {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// What this person is. All three can be false — most of a crew is none of them
    /// — and several can be true at once.
    pub seyu: bool,
    pub mangaka: bool,
    pub producer: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub japanese: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website: Option<String>,
    pub titles: i64,
    pub roles: i64,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Post {
    /// A string for the reason [`Me::id`] is one.
    pub id: PostId,
    pub body: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shikimori_id: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub episode: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent: Option<PostId>,
    pub at: String,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Default)]
pub struct PostBody {
    pub body: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shikimori_id: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub episode: Option<i32>,
    /// Read and ignored.
    ///
    /// A post used to be able to hide behind one flag; `||a phrase||` in the body
    /// does that properly and this door is a contract somebody else's code already
    /// sends. Refusing the field would break a client over a word that no longer
    /// means anything, so it is accepted and dropped.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub spoiler: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent: Option<PostId>,
}

impl PostBody {
    pub fn new(body: impl Into<String>) -> Self {
        Self {
            body: body.into(),
            ..Default::default()
        }
    }

    pub fn shikimori_id(mut self, value: impl Into<i32>) -> Self {
        self.shikimori_id = Some(value.into());
        self
    }

    pub fn title(mut self, value: impl Into<String>) -> Self {
        self.title = Some(value.into());
        self
    }

    pub fn episode(mut self, value: impl Into<i32>) -> Self {
        self.episode = Some(value.into());
        self
    }

    /// Read and ignored.
    ///
    /// A post used to be able to hide behind one flag; `||a phrase||` in the body
    /// does that properly and this door is a contract somebody else's code already
    /// sends. Refusing the field would break a client over a word that no longer
    /// means anything, so it is accepted and dropped.
    pub fn spoiler(mut self, value: impl Into<bool>) -> Self {
        self.spoiler = Some(value.into());
        self
    }

    pub fn parent(mut self, value: impl Into<PostId>) -> Self {
        self.parent = Some(value.into());
        self
    }
}

/// A public profile.
///
/// Narrower than the site's own, on purpose, and narrower in one direction: the
/// counts an account keeps to itself are **absent** here exactly as they are
/// there, because that decision is made in `social::profile_of`'s query and not
/// by whoever is formatting the answer. Copying the numbers out is safe; asking
/// for them a second way would not be.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Profile {
    pub id: String,
    pub nickname: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub banner: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub about: Option<String>,
    pub verified: bool,
    /// `user` | `mod` | `admin`
    pub role: String,
    /// The other names this account answers to, in the order they arranged them.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub also: Option<Vec<String>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub followers: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub following: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub titles: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub episodes: Option<i32>,
    pub joined_at: String,
}

/// How far through a title somebody is. It belongs to the title, not to a
/// folder: taking a title out of every folder keeps it.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Progress {
    pub shikimori_id: i32,
    /// the status folder it is in, if any: `watching` | `planned` | `done` |
    /// `paused` | `dropped`
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    pub episode: i32,
    /// absent where the catalogue does not know, which is "no ceiling", not "none"
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub episodes: Option<i32>,
    pub rewatching: bool,
    /// 1-10; null for a title they have not judged
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub score: Option<i32>,
    pub at: String,
}

/// Every refusal on this door, in the one shape they all take.
///
/// `message` is a **phrase name and never a sentence**: one room can hold five
/// languages at once, so the server does not get to choose which one an error
/// is read in. A client shows its own words for the names it knows and the name
/// itself for the ones it does not — which is also why the list of them is
/// stable enough to generate a typed error per name in six languages.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Refusal {
    /// e.g. `errors.oauthInsufficientScope`
    pub message: String,
    /// Extra fields a refusal owes a reason for, merged in beside `message` — the
    /// scope that was missing, how long a ban has left. Absent for most.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub detail: Option<serde_json::Value>,
}

/// A franchise entry: a card, plus where in the sequence the caller was.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Related {
    pub id: i64,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub year: Option<i32>,
    /// `tv` | `movie` | `ova` | `ona` | `special` | `music`
    pub kind: String,
    pub episodes: i32,
    /// The one number a reader sees: what the people here think of it and what the
    /// outside number said, weighed against each other.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub score: Option<f64>,
    /// whether this row *is* the title that was asked about
    pub current: bool,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Default)]
pub struct ScoreBody {
    /// 1 to 10
    pub score: i32,
}

impl ScoreBody {
    pub fn new(score: impl Into<i32>) -> Self {
        Self {
            score: score.into(),
            ..Default::default()
        }
    }
}

/// What somebody's watching adds up to.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Stats {
    pub planned: i64,
    pub watching: i64,
    pub rewatching: i64,
    pub paused: i64,
    pub done: i64,
    pub dropped: i64,
    pub episodes: i64,
    pub minutes: i64,
    pub rated: i64,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub average: Option<f64>,
}

/// A title, as its own page.
///
/// `wash` is on the site's shape and is not on this one. It is the colour a
/// page tints itself with, computed from the artwork on first read — a fact
/// about how this site draws a screen rather than a fact about the title, and
/// putting it in a frozen contract would be promising a stranger the house's
/// paint.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Title {
    pub id: i64,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub genres: Vec<String>,
    pub studios: Vec<String>,
    pub kind: String,
    /// `ongoing` | `released` | `announced`
    pub status: String,
    pub episodes: i32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub score: Option<f64>,
    /// And the two halves of that one number, for a caller with room to say so.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub our_score: Option<f64>,
    pub our_votes: i32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub year: Option<i32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rating: Option<String>,
    pub screenshots: Vec<String>,
}

/// A title as it appears in a list.
///
/// `id` is the shikimori id and is the only key this catalogue has ever had. It
/// is a number here rather than a string, unlike the ids above: these are five
/// and six digits and always will be, since they are somebody else's sequence
/// and not ours to outgrow.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct TitleCard {
    pub id: i64,
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub year: Option<i32>,
    /// `tv` | `movie` | `ova` | `ona` | `special` | `music`
    pub kind: String,
    pub episodes: i32,
    /// The one number a reader sees: what the people here think of it and what the
    /// outside number said, weighed against each other.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub score: Option<f64>,
}

/// One character in one title.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct TitleCharacter {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// `Main` or `Supporting`, as the source words it
    pub roles: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub voices: Option<Vec<Voice>>,
}

/// One person on one title, and what they did on it.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct TitleStaff {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// What this person is. All three can be false — most of a crew is none of them
    /// — and several can be true at once.
    pub seyu: bool,
    pub mangaka: bool,
    pub producer: bool,
    pub roles: Vec<String>,
}

/// Somebody who said the lines, and the language they said them in.
///
/// **`language` absent means nobody has said, which is not the same as "not
/// japanese".** The pass that fills it asks AniList for the japanese cast,
/// which can confirm a voice and can never rule one out. A client that reads
/// this as a boolean will label a chinese dub actress as the original.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Voice {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    /// What this person is. All three can be false — most of a crew is none of them
    /// — and several can be true at once.
    pub seyu: bool,
    pub mangaka: bool,
    pub producer: bool,
    /// a BCP-47 tag — `ja` for the original, and the only one written so far
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

/// A character somebody voiced, and where.
#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct VoicedRole {
    pub id: i64,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name_orig: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub poster: Option<String>,
    pub title: TitleCard,
    pub roles: Vec<String>,
}

/// Every scope this api offers.
pub const SCOPES: &[&str] = &[
    "catalog:read",
    "email",
    "lists:read",
    "lists:write",
    "offline_access",
    "openid",
    "people:read",
    "profile",
    "social:read",
    "social:write",
];
