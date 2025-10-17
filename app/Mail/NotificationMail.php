<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $messageText;

    /**
     * Tạo instance mới
     */
    public function __construct($subjectText, $messageText)
    {
        $this->subjectText = $subjectText;
        $this->messageText = $messageText;
    }

    /**
     * Build email
     */
    public function build()
    {
        return $this->subject($this->subjectText)
                    ->view('emails.notification')
                    ->with([
                        'subject' => $this->subjectText,
                        'messageText' => $this->messageText,
                    ]);
    }
}