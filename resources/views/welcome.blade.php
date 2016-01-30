@extends('layouts.master')

@section('content')
<h1>Meeting Request Form</h1>

@if (session('request_sent'))
    <div class="alert alert-success">
        Your meeting request has been sent. Thank you.
    </div>

    <a href="/">Add new meeting</a>
@else
    @include('common.form')
@endif

@stop
