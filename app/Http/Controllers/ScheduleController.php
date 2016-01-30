<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Repositories\ScheduleRepository;
use Mail;

class ScheduleController extends Controller
{
    /**
     * @var ScheduleRepository
     */
    protected $schedule;

    /**
     * Create a new controller instance.
     *
     * @param ScheduleRepository $schedule
     */
    public function __construct(ScheduleRepository $schedule)
    {
        $this->schedule = $schedule;
    }

    /**
     * Show the form to schedule a new meeting.
     *
     * @return Response
     */
    public function index()
    {
        return view('welcome', [
            'dates' => $this->schedule->countAdvanceByDate()
        ]);
    }

    /**
     * Save new meeting.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'date' => 'array',
            'date.*' => 'date_format:Y-n-j|after:yesterday'
        ]);

        Mail::send('emails.meeting', $request->toArray(), function($m) {
            $m->from('no-reply@devbase.net', 'Meeting Request App')
                ->to(env('MAIL_OWNER'))
                ->subject('New Meeting Request');
        });

        $this->schedule->storeRequest($request);

        return redirect('/')->with('request_sent', true);
    }
}
