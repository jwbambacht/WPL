module tmpls/sections

template metadata {
	
	head {
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		// <link href="http://localhost:8080/CryptFolio/stylesheets/bootstrap.min.css" rel="stylesheet" type="text/css">
		// <link href="http://localhost:8080/CryptFolio/stylesheets/bootstrap-icons.css" rel="stylesheet" type="text/css">
		// <link href="http://localhost:8080/CryptFolio/stylesheets/custom.css"  rel="stylesheet" type="text/css">
		// <script src="http://localhost:8080/CryptFolio/javascript/highcharts.js"></script>
		// <script src="~navigate(root())javascript/highcharts-data.js"></script>
	}
	
	includeCSS("bootstrap.min.css")
	includeCSS("bootstrap-icons.css")
	includeCSS("custom.css")
	includeJS("highcharts.js")
	includeJS("highcharts-data.js")
}

// template metadata {
// 	head {
// 		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no">
// 		<meta name="apple-mobile-web-app-capable" content="yes">
// 		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css">
// 		<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" rel="stylesheet" type="text/css">
// 		<link href="http://localhost:8080/TestProject/stylesheets/custom.css"  rel="stylesheet" type="text/css">
// 		<script src="https://code.highcharts.com/highcharts.js"></script>
// 		<script src="https://code.highcharts.com/modules/data.js"></script>
// 	}
// }

template headerSection {
	<header>
		elements
	</header>
}

template mainSection {
	<main class="container pb-5">
		elements
	</main>
}

template footerSection {
	<footer class="text-muted fixed-bottom p-2 mt-2 bg-dark">
		elements
	</footer>
}

template footerScrips {
	<script src="~navigate(root())javascript/jquery.min.js"></script>
	<script src="~navigate(root())javascript/jquery-ui.min.js"></script>
	<script src="~navigate(root())javascript/bootstrap.bundle.min.js"></script>
	<script src="https://www.jbambacht.nl/WPL/fetchData.js"></script>
	<script src="~navigate(root())javascript/highcharts.theme.js"></script>
}

// template footerScrips {
// 	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>
// 	<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous"></script>
// 	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
// 	// <script src="http://localhost:8080/TestProject/javascript/fetchData.js"></script>
// 	<script src="https://www.jbambacht.nl/WPL/fetchData.js"></script>
// 	<script src="http://localhost:8080/TestProject/javascript/highcharts.theme.js"></script>
// }