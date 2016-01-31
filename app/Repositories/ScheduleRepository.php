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

    /**
     * Get requested meeting slots for all dates in advance.
     *
     * Return as slots in a sorted associative array indexed by date.
     * Dates with zero meetings are omitted.
     *
     * @return array
     */
    public function getAdvanceByDate()
    {
        $now = new \DateTime;
        $h = $now->format('H');
        $m = $now->format('i');

        $lastDate = $now->format("Y-m-d");
        $lastSlot = $h . ":" . ($m <= 30 ? "00" : "30");

        $table = with(new Meeting)->getTable();

        $rows = DB::table($table)
            ->whereRaw('date > ? or (date = ? and time > ?)', [$lastDate, $lastDate, $lastSlot])
            ->select('date', 'time')
            ->orderBy('date', 'time')
            ->get();

        $data = [];
        foreach($rows as $row) {
            $date = $row->date;
            $time = $row->time;

            if (!isset($data[$date]))
                $data[$date] = array();

            $data[$date][] = $time;
        }

        return $data;
    }

    public function storeRequest($request)
    {
        $this->store($request->name, $request->email, $request->message, $request->datetimes);
    }

    /**
     * Insert multiple meetings at once
     *
     * @param $name
     * @param $email
     * @param $message
     * @param array|null $datetimes
     */
    public function store($name, $email, $note, $datetimes)
    {
        $data = compact('name', 'email', 'note');

        if (is_array($datetimes)) {
            $template = $data;
            $data = array_map(function($datetime) use ($template) {
                $d = $template;
                list($date, $time) = explode(' ', $datetime);
                $d['date'] = $date;
                $d['time'] = $time;
                return $d;
            }, $datetimes);
        }

        Meeting::insert($data);
    }
}
