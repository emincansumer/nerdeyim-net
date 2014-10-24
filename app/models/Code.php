<?php

class Code extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'codes';

    /**
     * Relationship with 'User' model
     */
    public function users() 
    {
        $this->hasMany('User');
    }

}