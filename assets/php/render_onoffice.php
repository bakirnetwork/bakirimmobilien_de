<?php

header('Content-Type: text/html; charset=utf-8');

function append_params($array, $parent='') {
	$params = array();
	foreach ($array as $k => $v)
	{
		if (is_array($v))
			$params[] = append_params($v, (empty($parent) ? urlencode($k) : $parent . '[' . urlencode($k) . ']'));
		else
			$params[] = (!empty($parent) ? $parent . '[' . urlencode($k) . ']' : urlencode($k)) . '=' . urlencode($v);
	}

	$sessid = session_id();
	if (!empty($parent) || empty($sessid))
		return implode('&', $params);

	$sessname = session_name();
	if (ini_get('session.use_cookies'))
	{
		if (!ini_get('session.use_only_cookies') && (!isset($_COOKIE[$sessname]) || ($_COOKIE[$sessname] != $sessid)))
			$params[] = $sessname . '=' . urlencode($sessid);
	}
	elseif (!ini_get('session.use_only_cookies'))
		$params[] = $sessname . '=' . urlencode($sessid);

	return implode('&', $params);
}

$onoffice_url = $_GET['url'];

$params = $_GET;
unset($params['url']);
$query = append_params($params);

$onoffice = file_get_contents('http://site1.bakir-immobilien.netcore.web2.onoffice.de' . $onoffice_url . '?' . $query);
$onoffice = str_replace(
	'<style type="text/css">@import "emi_style.xhtml?name=main";</style>',
	'
		<link rel="stylesheet" href="http://site1.bakir-immobilien.netcore.web2.onoffice.de/emi_style.xhtml?name=main">
		<style>.objectnumbersearch { display: none; }</style>
		<script src="/assets/js/vendor/iframeResizer.contentWindow.min.js"></script>
	',
	$onoffice
); // Hack: Austausch des CSS-Import zu einer globalen Ressource

echo $onoffice;

?>
