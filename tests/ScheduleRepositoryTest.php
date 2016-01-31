<?php

use App\Repositories\ScheduleRepository;

class ScheduleRepositoryTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();

        $this->m = Mockery::mock('Eloquent','App\Meeting[insert]');
        $this->app->instance('App\Meeting', $this->m);

        $this->repo = new ScheduleRepository();
    }
    /**
     * Add new request
     *
     * @return void
     */
    public function testStoreWithoutDateTime()
    {
        $this->m->shouldReceive('insert')->once()->with([
            'name' => 'Goran',
            'email' => 'grakic@devbase.net',
            'note' => '',
        ]);

        $this->repo->store('Goran', 'grakic@devbase.net');
    }

    public function testStoreWithSingleDateTime()
    {
        $this->m->shouldReceive('insert')->once()->with([[
            'name' => 'Goran',
            'email' => 'grakic@devbase.net',
            'note' => '',
            'date' => '2016-01-31',
            'time' => '19:00',
        ]]);

        $this->repo->store('Goran', 'grakic@devbase.net', null, array('2016-01-31 19:00'));
    }

    public function testStoreWithMultiDateTime()
    {
        $this->m->shouldReceive('insert')->once()->with([[
            'name' => 'Goran',
            'email' => 'grakic@devbase.net',
            'note' => '',
            'date' => '2016-01-31',
            'time' => '19:00',
        ], [
            'name' => 'Goran',
            'email' => 'grakic@devbase.net',
            'note' => '',
            'date' => '2016-01-31',
            'time' => '21:00',
        ]]);

        $this->repo->store('Goran', 'grakic@devbase.net', null, array('2016-01-31 19:00', '2016-01-31 21:00'));
    }

}
