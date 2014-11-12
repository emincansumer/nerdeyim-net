<?php

class Code extends Eloquent {

    /**
     * Fillable fields
     */
    protected $fillable = array('value', 'in_use');

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'codes';

    /**
     * Implemented boot event
     */
    public static function boot()
    {
        parent::boot();

        // deleted event
        Code::deleting(function($code){
             // remove users when code deleted
            $code->users()->delete();
        });
    }

    /**
     * Relationship with 'User' model
     */
    public function users() 
    {
        return $this->hasMany('User');
    }

}