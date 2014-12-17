@extends('layout.master')

@section('headerButtons')

<a href="#modal" class="icon icon-more-vertical pull-right"></a>

@stop

@section('content')

<div id="map-page" class="content">
    <div id="map"></div>
</div>
<input type="hidden" id="user_id" value="{{ $user->id }}">

<div id="modal" class="modal">
    <header class="bar bar-nav">
        <a class="icon icon-close pull-right" href="#modal"></a>
        <h1 class="title">Kod</h1>
    </header>
    <div class="content">
        <div class="content-padded">
            <h4 class="text-center">{{ $room->value }}</h4>
            <p>Yukarıdaki kodu diğer kullanıcıya göndererek konumunuzu paylaşabilirsiniz.</p>
        </div> 
    </div>
</div>

@stop