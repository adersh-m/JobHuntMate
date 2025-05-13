import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-email-sent',
    standalone: true,
    imports: [CommonModule,RouterLink],
    templateUrl: './email-sent.component.html',
    styleUrls: ['./email-sent.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmailSentComponent implements OnInit {
    @Input() context: 'forgot' | 'register' = 'forgot';

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Only show if navigated from a valid flow
        const allowed = sessionStorage.getItem('email-sent-allowed');
        if (!allowed) {
            this.router.navigate(['/login']);
        } else {
            // Clear the flag so it only shows once
            sessionStorage.removeItem('email-sent-allowed');
        }
    }

    get title(): string {
        return this.context === 'register' ? 'Verify Your Email' : 'Check Your Email';
    }

    get message(): string {
        if (this.context === 'register') {
            return 'We have sent a verification link to your email. Please check your inbox and follow the instructions to activate your account.';
        }
        return 'If the email you entered is registered, you will receive instructions shortly.';
    }

    get icon(): string {
        return this.context === 'register' ? 'fa-user-check' : 'fa-envelope';
    }
}
