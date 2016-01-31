@include('common.errors')

<form action="/meeting" method="POST" class="form-horizontal">
    {{ csrf_field() }}

    <div class="row">
        <div class="col-sm-12 col-md-6 col-md-push-6">

            <div class="alert alert-info">
                Please enter meeting request details in the form and optionally
                select one or multiple dates using the calendar widget.</div>

            <div class="form-group">
                <label for="meeting-name" class="col-sm-3 control-label">Name</label>
                <div class="col-sm-6">
                    <input type="text" name="name" id="meeting-name" class="form-control" value="{{ old('name') }}">
                </div>
            </div>

            <div class="form-group">
                <label for="meeting-email" class="col-sm-3 control-label">Email</label>
                <div class="col-sm-6">
                    <input type="text" name="email" id="meeting-email" class="form-control" value="{{ old('email') }}">
                </div>
            </div>

            <div class="form-group">
                <label for="meeting-note" class="col-sm-3 control-label">Note</label>
                <div class="col-sm-6">
                    <textarea name="note" id="meeting-note" rows="5" class="form-control" >{{ old('note') }}</textarea>
                </div>
            </div>

            <div class="form-group hidden-sm">
                <div class="col-sm-offset-3 col-sm-6">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-plus"></i> Schedule Meeting
                    </button>
                </div>
            </div>

        </div>

        <div class="col-sm-12 col-md-6 col-md-pull-6">

            <div id="timepicker">
                <select>
                    @foreach (range(0, 23) as $h)
                        <option value="{{ $h < 10 ? "0".$h : $h }}:00">{{ $h < 10 ? "0".$h : $h }}:00</option>
                        <option value="{{ $h < 10 ? "0".$h : $h }}:30">{{ $h < 10 ? "0".$h : $h }}:30</option>
                    @endforeach
                </select>
                <input type="button" value="Pick">
            </div>

            <div id="calendar"></div>

        </div>

    </div>

    <div class="row visible-sm">
        <div class="col-sm-12 col-md-6 col-md-offset-6">

            <div class="form-group">
                <div class="col-sm-offset-3 col-sm-6">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-plus"></i> Schedule Meeting
                    </button>
                </div>
            </div>

        </div>
    </div>

</form>

@section('scripts')
    @parent
<script src="/calendar.jquery.js"></script>
<script>
    var meetings = {!! json_encode($meetings) !!};
@if (old('datetimes'))
    var datetimes = {!! json_encode(old('datetimes')) !!};
@else
    var datetimes = new Array();
@endif
    $("#calendar").calendar($("#timepicker"), meetings, 'datetimes', datetimes);
</script>
@stop
