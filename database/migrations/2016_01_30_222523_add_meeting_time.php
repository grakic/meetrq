<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMeetingTime extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('meetings', function (Blueprint $table) {

            $slots = [];
            foreach(range(0, 23) as $h)
            {
                $h = $h < 10 ? "0".$h : $h;
                $slots[] = "$h:00";
                $slots[] = "$h:30";
            }

            $table->enum('time', $slots);

            // FIXME: fix existing entries before adding constraint!

            // prevent overbooking
            $table->unique(['date', 'time']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn('time');

            $table->dropUnique(['date', 'time']);
        });


    }
}
