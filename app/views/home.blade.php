@extends('layout.master')

@section('content')

<div class="content-padded">
    <h2 class="text-center">Nerede olduğunuzu tarif etmenin en kolay yolu</h2>
    <p class="text-center">Size verilen kodu girerek, diğer kullanıcının nerede olduğunu görebilir, yol tarifini öğrenebilirsiniz.</p>
    <form action="" method="post" class="main-form">
        <input type="text" id="code" placeholder="Kod...">
        <button class="btn btn-positive btn-block" type="submit">Katıl</button>
    </form>
    <p class="text-center"><b>veya</b></p>
    <button class="btn btn-primary btn-block js-share-action">Konumumu Paylaş</button>
</div>

@stop
