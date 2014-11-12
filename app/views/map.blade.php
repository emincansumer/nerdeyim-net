@extends('layout.master')

@section('content')

<div id="map-page" class="content">
    <div id="map"></div>
</div>
<input type="hidden" id="user_id" value="{{ $user->id }}">

@stop