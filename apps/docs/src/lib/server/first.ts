import { coloured } from './highlight';

/**
 * The front page's code, coloured on the server.
 *
 * Written out rather than generated: the front page is an argument about what
 * this api is for, and the shortest honest call in each language — lifted from
 * that library's own README, so the two cannot drift apart unnoticed by a
 * reader who has both open — is a better argument than the most
 * representative one.
 */
export const FIRST: { id: string; label: string; lang: string; install: string; code: string }[] = [
	{
		id: 'typescript',
		label: 'TypeScript',
		lang: 'typescript',
		install: 'bun add @acyka/api',
		code: `import { Acyka } from '@acyka/api';

// a bot has nobody to sign in, so it acts for itself
const acyka = Acyka.app({ clientId, clientSecret });

const found = await acyka.catalogue.listTitles({ q: 'frieren', limit: 5 });

for await (const title of acyka.catalogue.listTitlesAll({ genre: 'Drama' })) {
  console.log(title.title, title.year);
}`
	},
	{
		id: 'python',
		label: 'Python',
		lang: 'python',
		install: 'pip install acyka',
		code: `import os
from acyka import Acyka

with Acyka.app(
    client_id=os.environ["ACYKA_ID"],
    client_secret=os.environ["ACYKA_SECRET"],
) as acyka:
    for title in acyka.catalogue.list_titles(q="frieren", limit=5):
        print(title.id, title.title, title.year)

    for title in acyka.catalogue.list_titles_all(genre="Drama"):
        print(title.title)`
	},
	{
		id: 'rust',
		label: 'Rust',
		lang: 'rust',
		install: 'cargo add acyka',
		code: `use acyka::Acyka;

#[tokio::main]
async fn main() -> acyka::Result<()> {
    let acyka = Acyka::app(env!("ACYKA_ID"), env!("ACYKA_SECRET"))?;

    let found = acyka.catalogue().list_titles().q("frieren").limit(5).send().await?;
    for title in found {
        println!("{} {}", title.id, title.title);
    }
    Ok(())
}`
	},
	{
		id: 'kotlin',
		label: 'Kotlin',
		lang: 'kotlin',
		install: 'implementation("cc.acyka:acyka:1.0.0")',
		code: `val acyka = Acyka.app(
    clientId = System.getenv("ACYKA_ID"),
    clientSecret = System.getenv("ACYKA_SECRET"),
)

val found = acyka.catalogue.listTitles(q = "frieren", limit = 5)
found.forEach { println("\${it.id} \${it.title}") }

acyka.catalogue.listTitlesAll(genre = "Drama").collect { println(it.title) }`
	},
	{
		id: 'csharp',
		label: 'C#',
		lang: 'csharp',
		install: 'dotnet add package Acyka',
		code: `using Acyka;

var acyka = AcykaClient.App(
    Environment.GetEnvironmentVariable("ACYKA_ID")!,
    Environment.GetEnvironmentVariable("ACYKA_SECRET")!);

var found = await acyka.Catalogue.ListTitlesAsync(q: "frieren", limit: 5);

await foreach (var title in acyka.Catalogue.ListTitlesAllAsync(genre: "Drama"))
    Console.WriteLine(title.Title);`
	},
	{
		id: 'cpp',
		label: 'C++',
		lang: 'cpp',
		install: 'FetchContent_Declare(acyka … SOURCE_SUBDIR packages/cpp)',
		code: `#include <acyka/acyka.hpp>

int main() {
    auto acyka = acyka::client::app(std::getenv("ACYKA_ID"), std::getenv("ACYKA_SECRET"));

    acyka::ListTitlesRequest asking;
    asking.q = "frieren";
    asking.limit = 5;

    for (const auto& title : acyka.catalogue.list_titles(asking))
        std::cout << title.id << ' ' << title.title << '\\n';
}`
	},
	{
		id: 'curl',
		label: 'curl',
		lang: 'bash',
		install: 'brew install curl',
		code: `# an application token, good for an hour
curl -s https://acyka.cc/api/oauth2/token \\
  -d grant_type=client_credentials -d scope=catalog:read \\
  -u "$ACYKA_ID:$ACYKA_SECRET"

curl -s "https://api.acyka.cc/api/v1/titles?q=frieren&limit=5" \\
  -H "Authorization: Bearer $ACYKA_TOKEN"`
	}
];

/** The same, coloured, for a page to hand to `Samples`. */
export async function first() {
	return Promise.all(
		FIRST.map(async (one) => ({
			id: one.id,
			label: one.label,
			install: one.install,
			code: one.code,
			html: await coloured(one.code, one.lang)
		}))
	);
}

/** Just the install lines, coloured as shell. */
export async function installs() {
	return Promise.all(
		FIRST.filter((one) => one.id !== 'curl').map(async (one) => ({
			id: one.id,
			label: one.label,
			code: one.install,
			html: await coloured(one.install, one.id === 'kotlin' ? 'kotlin' : one.id === 'cpp' ? 'cmake' : 'bash')
		}))
	);
}
