import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from '../core/auth.guard';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

const chatRoute: Routes = [
  {
    path: ':fid',
    component: ChatComponent,
    data: { title: 'CHAT_PAGE' },
    resolve: { chat: ChatResolver },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(chatRoute)
  ],
  providers: [ChatResolver],
  declarations: [ChatComponent]
})
export class AppChatModule { }
