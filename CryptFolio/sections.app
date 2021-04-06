module sections

template metadata {
	
	head {
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
	}
	
	includeCSS("bootstrap.min.css")
	includeCSS("bootstrap-icons.css")
	includeCSS("custom.css")
	includeJS("highstock.js")
	includeJS("highcharts-data.js")
}

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
	<script src="~navigate(root())javascript/fetchData.js"></script>
	<script src="~navigate(root())javascript/highcharts.theme.js"></script>
}