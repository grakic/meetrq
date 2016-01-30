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
                    <input type="text" name="name" id="meeting-name" class="form-control">
                </div>
            </div>

            <div class="form-group">
                <label for="meeting-email" class="col-sm-3 control-label">Email</label>
                <div class="col-sm-6">
                    <input type="text" name="email" id="meeting-email" class="form-control">
                </div>
            </div>

            <div class="form-group">
                <label for="meeting-note" class="col-sm-3 control-label">Note</label>
                <div class="col-sm-6">
                    <textarea name="note" id="meeting-note" rows="5" class="form-control" ></textarea>
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
    var meetings = {!! json_encode($dates) !!};
    $("#calendar").calendar(null, null, null, meetings, 'date');
</script>
@stop
