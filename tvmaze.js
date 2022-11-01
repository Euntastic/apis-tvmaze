/** Endpoints
 * http://api.tvmaze.com/search/shows?q=<search query>
 * http://api.tvmaze.com/shows/<show id>/episodes
 */
const searchShowsURL = "https://api.tvmaze.com/search/shows";

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // Request for query results
  const response = await axios.get(searchShowsURL, { params: { q: query } });

  const searchResults = [];

  // Creates objects with id, name, summary and image only.
  // Then add them to a list.
  for (let show of response.data) {
    let showListing = (({ id, name, summary, image }) => ({
      id,
      name,
      summary,
      image,
    }))(show.show);
    searchResults.push(showListing);
  }

  return searchResults;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    console.log(show);
    if (show.image == null)
      show.image = { medium: "https://tinyurl.com/tv-missing" };
    if (show.summary == null) show.summary = "Missing Summary";
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
          <div class="card" data-show-id="${show.id}">
            <img class="card-img-top" src="${show.image.medium}">
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <button class="btn btn-primary summary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${show.id}" aria-expanded="false" aria-controls="collapse-${show.id}">
              Summary
              </button>
              <button class="btn btn-primary episodes" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-episodes" aria-expanded="false" aria-controls="collapse-episodes">
              Episodes
              </button>
              <div class="collapse" id="collapse-${show.id}">
                <div class="card card-body">
                  ${show.summary}
                </div>
              </div>
            </div>
          </div>
        </div>`
    );
    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
async function handleSearch(event) {
  event.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  $(".episodes").click(getEpisodes);
}

$("#search-form").on("submit", handleSearch);

async function handleEpisode(event) {
  event.preventDefault();
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  // episode = { id, name, season, number }
  for (let episode of episodes) {
    console.log(episode);
    if (episode.summary == null) episode.summary = "Missing Summary";
    let $item = $(
      `<div>
        </div>`
    );
    $showsList.append($item);
  }
}
/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(event) {
  event.preventDefault();
  let showId = event.target.parentNode.parentNode.dataset.showId;
  console.log(showId);

  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let showURL = `http://api.tvmaze.com/shows/${showId}/episodes`;
  const response = await axios.get(showURL);

  const searchResults = [];

  for (let episode of response.data) {
    console.log(episode);
    let episodeListing = (({ id, name, season, number }) => ({
      id,
      name,
      season,
      number,
    }))(episode);
    searchResults.push(episodeListing);
  }

  console.log(searchResults);
  // TODO: return array-of-episode-info, as described in docstring above
  return searchResults;
}
