<?php

use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    protected $table = 'files';

    public function saveNewFile($directory) {

        $this->makeDirectoryIfNotExists($directory);
        $this->removeActualFile($directory);
        $this->setupFileTypeParts();

        // Name the file
        $this->name = 'file_' . rand(10000, 99999) . '_' . helpers::replaceSpecialCharacters($_FILES['file']['name']);

        try {
            if(move_uploaded_file($_FILES['file']['tmp_name'], $directory . $this->name)){
                return true;
            }   
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }

        return false;
    }

    private function makeDirectoryIfNotExists($directory){
        if(!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
    }

    private function removeActualFile($directory){
        $this->removeFile($directory);
    }

    private function removeFile($directory){
        if($this->name) {
            if(file_exists($directory . $this->name)){
                unlink($directory . $this->name);
            }
        }
    }

    private function setupFileTypeParts() {
        $typeParts = explode('/', $_FILES['file']['type']);

        $this->type = $typeParts[0] ?: 'file';
        $this->extension = $typeParts[1] ?: '';
    }
}