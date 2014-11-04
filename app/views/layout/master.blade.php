<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>@yield('title', 'Nerdeyim.net')</title>
    <meta name="description" content="">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    @yield('meta')
    @section('style')
    <link rel="stylesheet" href="{{ URL::asset('assets/css/ratchet.min.css') }}">
    <link rel="stylesheet" href="{{ URL::asset('assets/css/main.css') }}">
    @show
    <!-- App -->
    <script>
        window.App     = window.App || {};
        App.siteURL    = '{{ URL::to("/") }}';
        App.currentURL = '{{ URL::current() }}';
        App.fullURL    = '{{ URL::full() }}';
        App.assetURL   = '{{ URL::to("assets") }}';
    </script>
 
    @yield('script.header')
 
</head>
<body>

    <header class="bar bar-nav">
        <h1 class="title">@yield('pageTitle', 'Nerdeyim.net')</h1>
    </header>

    <div class="content">
        @yield('content')
    </div>

    @section('script.footer')
    <script src="{{ URL::asset('assets/js/zepto.min.js') }}"></script>
    <script src="{{ URL::asset('assets/js/ratchet.min.js') }}"></script>
    <script src="{{ URL::asset('assets/js/main.js') }}"></script>
    @show
</body>
</html>