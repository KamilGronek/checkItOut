import {inject} from '@angular/core';
import {NavigationService} from 'app/core/services/navigation.service';
import {MessagesService} from 'app/shared/components/layout/messages/messages.service';
import {NotificationsService} from 'app/shared/components/layout/notifications/notifications.service';
import {QuickChatService} from 'app/shared/components/layout/quick-chat/quick-chat.service';
import {ShortcutsService} from 'app/shared/components/layout/shortcuts/shortcuts.service';
import {forkJoin} from 'rxjs';

import {Firestore} from '@angular/fire/firestore';

export const initialDataResolver = () => {
    const messagesService = inject(MessagesService);
    const navigationService = inject(NavigationService);
    const notificationsService = inject(NotificationsService);
    const quickChatService = inject(QuickChatService);
    const shortcutsService = inject(ShortcutsService);
    const firestore: Firestore = inject(Firestore);

    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        navigationService.get(),
        messagesService.getAll(),
        notificationsService.getAll(),
        quickChatService.getChats(),
        shortcutsService.getAll(),
    ]);
};
