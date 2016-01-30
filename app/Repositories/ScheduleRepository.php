<?php
namespace App\Repositories;

use DB;
use App\Meeting;

class ScheduleRepository
{
    /**
     * Get meeting counts for all dates in advance.
     *
     * Return as meeting counts in a sorted associative array indexed by date.
     * Dates with zero counts are omitted.
     *
     * @return array
     */
    public function countAdvanceByDate()
    {
        $today = new \DateTime;

        $table = with(new Meeting)->getTable();

        $data = DB::table($table)
            ->select('date', DB::raw('COUNT(id) as meetings_count'))
            ->groupBy('date')
            ->having('date', '>=', $today)
            ->orderBy('date')
            ->get();

        // create associative array
        return array_combine(
            array_column($data, 'date'),
            array_column($data, 'meetings_count')
        );
    }

    public function storeRequest($request)
    {
        $this->store($request->name, $request->email, $request->message, $request->date);
    }

    /**
     * Insert multiple meetings at once
     *
     * @param $name
     * @param $email
     * @param $message
     * @param array|null $dates
     */
    public function store($name, $email, $note, $dates)
    {
        $data = compact('name', 'email', 'note');

        if (is_array($dates)) {
            $template = $data;
            $data = array_map(function($date) use ($template) {
                $d = $template;
                $d['date'] = $date;
                return $d;
            }, $dates);
        }

        Meeting::insert($data);
    }
}
