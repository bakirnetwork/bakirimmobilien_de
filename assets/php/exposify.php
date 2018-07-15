<?php

/**
 * Blueprint class to bundle API functionality.
 */
abstract class ApiBlueprint
{
	/**
	 * API JSON result converted to an array.
	 *
	 * @var array
	 */
	protected $result = [];

	/**
	 * API JSON error converted to an array.
	 *
	 * @var array
	 */
	protected $error = [];

	/**
	 * The URL to connect with Exposify API.
	 *
	 * @var string
	 */
	protected $apiUrl = '';

	/**
	 * The secret key to connect with Exposify API.
	 *
	 * @var string
	 */
	protected $apiKey = '';

	/**
	 * Request and store data from a specific URL.
	 *
	 * @param  string  $url
	 * @return void
	 */
	protected function requestData($url)
	{
		$curl = curl_init();
		curl_setopt_array($curl, [
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL            => $url,
			CURLOPT_TIMEOUT        => 12
		]);
		$json = json_decode(curl_exec($curl), true);

		if (isset($json['error'])) {
			$this->error = $json['error'];
		} else if (isset($json['data'])) {
			$this->result = $json['data'];
		} else {
			$this->error = [
				'title' => 'Server Error',
				'description' => 'The server did not return valid data.'
			];
		}

		curl_close($curl);
	}

	/**
	 * Request all properties.
	 *
	 * @param  string  $searchQuery
	 * @param  array  $types
	 * @param  array  $marketing
	 * @return void
	 */
	public function requestAllProperties($defaultTitle = 'Immobilienangebote', $searchQuery = '', $types = [], $marketing = [])
	{
		$url = $this->apiUrl . '?api_token=' . $this->apiKey;
		$url = $url . '&search=' . urlencode($searchQuery);
		$url = $url . '&types=' . urlencode(implode(',', $types));
		$url = $url . '&marketing=' . urlencode(implode(',', $marketing));
		$url = $url . '&origin=' . urlencode($this->getRequestOriginUrl());
		$url = $url . '&template=simple';
		$url = $url . '&title_properties_page=' . urlencode($defaultTitle);

		$this->requestData($url);
	}

	/**
	 * Request a single property.
	 *
	 * @param  string  $slug
	 * @return void
	 */
	public function requestSingleProperty($slug)
	{
		$url = $this->apiUrl . '/' . $slug . '?api_token=' . $this->apiKey;
		$url = $url . '&origin=' . urlencode($this->getRequestOriginUrl($slug));
		$url = $url . '&template=simple';

		$this->requestData($url);
	}

	/**
	 * We retrieve the origin of the request by splitting the REQUEST_URI at the
	 * slug and using the first part to build an origin URL.
	 *
	 * @param  string  $slug
	 * @return string
	 */
	protected function getRequestOriginUrl($slug = null)
	{
		if ($slug) {
			$propertyPath = explode('/' . $slug, $_SERVER['REQUEST_URI'])[0];
		} else {
			$propertyPath = $_SERVER['REQUEST_URI'];
		}
		return (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $propertyPath;
	}

	/**
	 * Return the result of the finished request.
	 *
	 * @return array
	 */
	public function getResult()
	{
		return $this->result;
	}

	/**
	 * Return the error of the finished request.
	 *
	 * @return array
	 */
	public function getError()
	{
		return $this->error;
	}
}

/**
 * Class to allow access to the HTML API.
 */
class HtmlHandler extends ApiBlueprint
{
	/**
	 * Construct the class.
	 *
	 * @param  string  $apiUrl
	 * @param  string  $apiKey
	 * @return void
	 */
	public function __construct($apiUrl, $apiKey)
	{
		$this->apiUrl = $apiUrl;
		$this->apiKey = $apiKey;
	}

	/**
	 * Output the result of the HTML API request.
	 *
	 * @return void
	 */
	public function getContent()
	{
		if (!empty($this->error)) {
			http_response_code($this->error['id'] ?: 404);
			return htmlspecialchars_decode($this->error['attributes']['html']);
		} else {
			return htmlspecialchars_decode($this->result['attributes']['html']);
		}
	}

	/**
	 * Output the title of the requested property.
	 *
	 * @return void
	 */
	public function getTitle()
	{
		if (isset($this->result['attributes']['title'])) {
			return $this->result['attributes']['title'];
		}
	}

	/**
	 * Output the description of the requested property.
	 *
	 * @return void
	 */
	public function getDescription()
	{
		if (isset($this->result['attributes']['description'])) {
			return $this->result['attributes']['description'];
		}
	}
}

/**
 * Class to handle the JSON API and allow access to the HTML API.
 */
class Exposify extends ApiBlueprint
{
	/**
	 * The HtmlHandler Instance.
	 *
	 * @var HtmlHandler
	 */
	public $html = null;

	/**
	 * Construct the class and instantiate the HtmlHandler.
	 *
	 * @param  string  $apiKey
	 * @return void
	 */
	public function __construct($apiKey, $apiBaseUrl = 'https://app.exposify.de')
	{
		$this->apiUrl = $apiBaseUrl . '/api/v1/json';
		$this->apiKey = $apiKey;
		$this->html   = new HtmlHandler('https://sites.exposify.de', $apiKey);
	}
}
