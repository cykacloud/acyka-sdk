// Generated from openapi.json by tools/generate.ts. Do not edit.

package cc.acyka.api

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.JsonElement

/**
 * the account a token acts for
 */
public class Account internal constructor(private val core: Core) {

    /**
     * It exists beside userinfo rather than instead of it because userinfo's shape
     * is fixed by the spec and this one is ours to grow.
     */
    public suspend fun getMe(): Me {
        return core.call(
            method = "GET",
            path = "/api/v1/me",
        )
    }
}

/**
 * titles, people, characters and what is airing
 */
public class Catalogue internal constructor(private val core: Core) {

    /**
     * A projection rather than a schedule: an ongoing series has no per-episode
     * timetable anywhere upstream, so the day of episode *n* is worked out from
     * the start date and a seven-day cadence. Irregular shows are wrong by a few
     * days and this says nothing about it, because a calendar that hid everything
     * it was not certain of would be an empty page most weeks. `out` is the part
     * that is not a projection — an episode a dub is already held for is playable
     * now, whatever the arithmetic says.
     *
     * The site's `?mine=1` is not offered. It narrows to the reader's own shelf,
     * which is a second way of asking a question `/v1/lists` already answers, and
     * a filter that means nothing at all for an application speaking for itself.
     * The `viewer` argument below is therefore `None` — it exists to answer that
     * filter and there is nothing else it decides.
     *
     * 18+ is the caller's own switch, like every other read here: a calendar is a
     * shelf with dates on it, and it must not be the one page that names a title
     * the reader asked not to see.
     */
    public suspend fun calendar(lang: String? = null): Page<Airing> {
        return core.call(
            method = "GET",
            path = "/api/v1/calendar",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    public suspend fun characterTitles(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Page<Appearance> {
        return core.call(
            method = "GET",
            path = "/api/v1/characters/${urlencode(id.toString())}/titles",
            query = listOf(
                "lang" to lang,
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [characterTitles], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun characterTitlesAll(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Flow<Appearance> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = characterTitles(limit = window, offset = at, id = id, lang = lang)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    /**
     * Whoever has voiced this character, once each, japanese first.
     */
    public suspend fun characterVoices(id: Long, lang: String? = null): Page<Voice> {
        return core.call(
            method = "GET",
            path = "/api/v1/characters/${urlencode(id.toString())}/voices",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    public suspend fun getCharacter(id: Long, lang: String? = null): Character {
        return core.call(
            method = "GET",
            path = "/api/v1/characters/${urlencode(id.toString())}",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    public suspend fun getPerson(id: Long, lang: String? = null): PersonPage {
        return core.call(
            method = "GET",
            path = "/api/v1/people/${urlencode(id.toString())}",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    public suspend fun getTitle(id: Long, lang: String? = null): Title {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    /**
     * The vocabulary the whole catalogue is described in.
     */
    public suspend fun listGenres(): Page<String> {
        return core.call(
            method = "GET",
            path = "/api/v1/genres",
        )
    }

    public suspend fun listTitles(lang: String? = null, limit: Long? = null, offset: Long? = null, q: String? = null, order: String? = null, status: String? = null, kind: String? = null, genre: String? = null, score: Double? = null, yearFrom: Int? = null, yearTo: Int? = null, rating: String? = null): Page<TitleCard> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles",
            query = listOf(
                "lang" to lang,
                "limit" to limit,
                "offset" to offset,
                "q" to q,
                "order" to order,
                "status" to status,
                "kind" to kind,
                "genre" to genre,
                "score" to score,
                "year_from" to yearFrom,
                "year_to" to yearTo,
                "rating" to rating,
            ),
        )
    }

    /**
     * Every row of [listTitles], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun listTitlesAll(lang: String? = null, limit: Long? = null, offset: Long? = null, q: String? = null, order: String? = null, status: String? = null, kind: String? = null, genre: String? = null, score: Double? = null, yearFrom: Int? = null, yearTo: Int? = null, rating: String? = null): Flow<TitleCard> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = listTitles(limit = window, offset = at, lang = lang, q = q, order = order, status = status, kind = kind, genre = genre, score = score, yearFrom = yearFrom, yearTo = yearTo, rating = rating)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    /**
     * The other half of a voice actor: who they have played.
     */
    public suspend fun personCharacters(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Page<VoicedRole> {
        return core.call(
            method = "GET",
            path = "/api/v1/people/${urlencode(id.toString())}/characters",
            query = listOf(
                "lang" to lang,
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [personCharacters], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun personCharactersAll(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Flow<VoicedRole> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = personCharacters(limit = window, offset = at, id = id, lang = lang)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    public suspend fun personTitles(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Page<Appearance> {
        return core.call(
            method = "GET",
            path = "/api/v1/people/${urlencode(id.toString())}/titles",
            query = listOf(
                "lang" to lang,
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [personTitles], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun personTitlesAll(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Flow<Appearance> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = personTitles(limit = window, offset = at, id = id, lang = lang)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    /**
     * One title, at random, out of the ones that can actually be watched here.
     */
    public suspend fun randomTitle(lang: String? = null): TitleCard {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/random",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    /**
     * The title asked about is in the list rather than dropped from it, because
     * the one thing this shelf is for is saying where in a sequence somebody is —
     * `current` is what lets a client mark it in place.
     */
    public suspend fun relatedTitles(id: Long, lang: String? = null): Page<Related> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}/related",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    /**
     * A resource of its own rather than a kind inside one `/search`. The site has
     * a single search window because a person typing wants one box, and it answers
     * an object of six collections — a shape built for that window. An application
     * looking for a character wants characters, paged, and asking it to unwrap
     * five lists it did not want is the `?include=` this api does not have,
     * backwards.
     */
    public suspend fun searchCharacters(q: String? = null, lang: String? = null, limit: Long? = null): Page<CharacterCard> {
        return core.call(
            method = "GET",
            path = "/api/v1/characters",
            query = listOf(
                "q" to q,
                "lang" to lang,
                "limit" to limit,
            ),
        )
    }

    public suspend fun searchPeople(q: String? = null, lang: String? = null, limit: Long? = null): Page<PersonCard> {
        return core.call(
            method = "GET",
            path = "/api/v1/people",
            query = listOf(
                "q" to q,
                "lang" to lang,
                "limit" to limit,
            ),
        )
    }

    /**
     * The weighting is the whole of what makes this useful rather than "the twelve
     * most popular titles in the catalogue", and it is not a thing to have two of
     * — so this is `similar_to`, the same shelf `/similar` in Discord is.
     */
    public suspend fun similarTitles(id: Long, lang: String? = null): Page<TitleCard> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}/similar",
            query = listOf(
                "lang" to lang,
            ),
        )
    }

    public suspend fun titleCharacters(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Page<TitleCharacter> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}/characters",
            query = listOf(
                "lang" to lang,
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [titleCharacters], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun titleCharactersAll(id: Long, lang: String? = null, limit: Long? = null, offset: Long? = null): Flow<TitleCharacter> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = titleCharacters(limit = window, offset = at, id = id, lang = lang)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    /**
     * **Not a list of episodes to watch, and deliberately not one.** Where a dub
     * can be played and by whom is `/video/streams`, which is somebody else's
     * files under somebody else's terms and is not on this door at all. This is
     * what the `shots` pass pulled onto our own storage, and an episode with no
     * frames is simply absent.
     */
    public suspend fun titleEpisodes(id: Long): Page<Episode> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}/episodes",
        )
    }

    public suspend fun titleScreenshots(id: Long): Page<String> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}/screenshots",
        )
    }

    public suspend fun titleStaff(id: Long, lang: String? = null): Page<TitleStaff> {
        return core.call(
            method = "GET",
            path = "/api/v1/titles/${urlencode(id.toString())}/staff",
            query = listOf(
                "lang" to lang,
            ),
        )
    }
}

/**
 * other people, as far as they have agreed to be read
 */
public class People internal constructor(private val core: Core) {

    public suspend fun getUser(nick: String): Profile {
        return core.call(
            method = "GET",
            path = "/api/v1/users/${urlencode(nick.toString())}",
        )
    }

    /**
     * People by name.
     */
    public suspend fun searchUsers(q: String? = null, limit: Long? = null): Page<Person> {
        return core.call(
            method = "GET",
            path = "/api/v1/users",
            query = listOf(
                "q" to q,
                "limit" to limit,
            ),
        )
    }

    /**
     * Somebody's public folders, behind the audience they chose for folders.
     */
    public suspend fun userFolders(nick: String): Page<Folder> {
        return core.call(
            method = "GET",
            path = "/api/v1/users/${urlencode(nick.toString())}/folders",
        )
    }

    public suspend fun userFollowers(nick: String, limit: Long? = null, offset: Long? = null): Page<Person> {
        return core.call(
            method = "GET",
            path = "/api/v1/users/${urlencode(nick.toString())}/followers",
            query = listOf(
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [userFollowers], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun userFollowersAll(nick: String, limit: Long? = null, offset: Long? = null): Flow<Person> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = userFollowers(limit = window, offset = at, nick = nick)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    public suspend fun userFollowing(nick: String, limit: Long? = null, offset: Long? = null): Page<Person> {
        return core.call(
            method = "GET",
            path = "/api/v1/users/${urlencode(nick.toString())}/following",
            query = listOf(
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [userFollowing], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun userFollowingAll(nick: String, limit: Long? = null, offset: Long? = null): Flow<Person> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = userFollowing(limit = window, offset = at, nick = nick)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    public suspend fun userStats(nick: String): Stats {
        return core.call(
            method = "GET",
            path = "/api/v1/users/${urlencode(nick.toString())}/stats",
        )
    }
}

/**
 * somebody's own folders and how far through each title they are
 */
public class Library internal constructor(private val core: Core) {

    public suspend fun addFolderItem(code: String, shikimoriId: Int, body: ItemBody): Unit {
        return core.call(
            method = "PUT",
            path = "/api/v1/folders/${urlencode(code.toString())}/items/${urlencode(shikimoriId.toString())}",
            body = body,
        )
    }

    public suspend fun createFolder(body: FolderBody): Folder {
        return core.call(
            method = "POST",
            path = "/api/v1/folders",
            body = body,
        )
    }

    public suspend fun deleteFolder(code: String): Unit {
        return core.call(
            method = "DELETE",
            path = "/api/v1/folders/${urlencode(code.toString())}",
        )
    }

    public suspend fun editFolder(code: String, body: FolderPatch): Folder {
        return core.call(
            method = "PATCH",
            path = "/api/v1/folders/${urlencode(code.toString())}",
            body = body,
        )
    }

    public suspend fun getFolder(code: String): Folder {
        return core.call(
            method = "GET",
            path = "/api/v1/folders/${urlencode(code.toString())}",
        )
    }

    public suspend fun getProgress(shikimoriId: Int): Progress {
        return core.call(
            method = "GET",
            path = "/api/v1/progress/${urlencode(shikimoriId.toString())}",
        )
    }

    public suspend fun listFolderItems(code: String, q: String? = null): Page<FolderItem> {
        return core.call(
            method = "GET",
            path = "/api/v1/folders/${urlencode(code.toString())}/items",
            query = listOf(
                "q" to q,
            ),
        )
    }

    public suspend fun listMyFolders(): Page<Folder> {
        return core.call(
            method = "GET",
            path = "/api/v1/folders",
        )
    }

    public suspend fun rateTitle(shikimoriId: Int, body: ScoreBody): Progress {
        return core.call(
            method = "PUT",
            path = "/api/v1/progress/${urlencode(shikimoriId.toString())}/score",
            body = body,
        )
    }

    public suspend fun removeFolderItem(code: String, shikimoriId: Int): Unit {
        return core.call(
            method = "DELETE",
            path = "/api/v1/folders/${urlencode(code.toString())}/items/${urlencode(shikimoriId.toString())}",
        )
    }

    public suspend fun setProgress(shikimoriId: Int, body: EpisodeBody): Progress {
        return core.call(
            method = "PUT",
            path = "/api/v1/progress/${urlencode(shikimoriId.toString())}",
            body = body,
        )
    }

    public suspend fun unrateTitle(shikimoriId: Int): Unit {
        return core.call(
            method = "DELETE",
            path = "/api/v1/progress/${urlencode(shikimoriId.toString())}/score",
        )
    }
}

/**
 * their writing, and who they read
 */
public class Social internal constructor(private val core: Core) {

    public suspend fun followUser(nickname: String): Unit {
        return core.call(
            method = "PUT",
            path = "/api/v1/following/${urlencode(nickname.toString())}",
        )
    }

    public suspend fun listMyFollowing(limit: Long? = null, offset: Long? = null): Page<Person> {
        return core.call(
            method = "GET",
            path = "/api/v1/following",
            query = listOf(
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [listMyFollowing], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun listMyFollowingAll(limit: Long? = null, offset: Long? = null): Flow<Person> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = listMyFollowing(limit = window, offset = at)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    /**
     * Not the feed: `social:read` is permission to read *this person's* social
     * life, not everybody's. A timeline of other people's writing is a different
     * question with a different answer about who may see what, and it is not
     * behind this word.
     */
    public suspend fun listMyPosts(limit: Long? = null, offset: Long? = null): Page<Post> {
        return core.call(
            method = "GET",
            path = "/api/v1/posts",
            query = listOf(
                "limit" to limit,
                "offset" to offset,
            ),
        )
    }

    /**
     * Every row of [listMyPosts], a page at a time.
     *
     * Stops when a page comes back shorter than it asked for rather than
     * when `total` is reached: the list can grow while it is being read, and
     * counting against a number from the first page walks off the end.
     */
    public fun listMyPostsAll(limit: Long? = null, offset: Long? = null): Flow<Post> = flow {
        val window = limit ?: 100
        var at = offset ?: 0
        while (true) {
            val page = listMyPosts(limit = window, offset = at)
            page.items.forEach { emit(it) }
            if (page.items.size < window) return@flow
            at += page.items.size
        }
    }

    public suspend fun unfollowUser(nickname: String): Unit {
        return core.call(
            method = "DELETE",
            path = "/api/v1/following/${urlencode(nickname.toString())}",
        )
    }

    public suspend fun writePost(body: PostBody): Post {
        return core.call(
            method = "POST",
            path = "/api/v1/posts",
            body = body,
        )
    }
}
