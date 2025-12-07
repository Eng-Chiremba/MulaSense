import { useState } from 'react';
import { Bell, Menu, User, Settings, HelpCircle, LogOut, Building2, MessageSquare, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { mockUser, mockNotifications } from '@/data/mockData';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: MessageSquare, label: 'AI Advisor', path: '/ai-advisor' },
  { icon: Building2, label: 'Banking', path: '/banking' },
  { icon: CreditCard, label: 'Cards', path: '/cards' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 glass border-b border-border safe-top">
      <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
        {/* Menu Button */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-6 gradient-hero">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-primary-foreground/30">
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-semibold">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <SheetTitle className="text-primary-foreground font-semibold">
                    {mockUser.name}
                  </SheetTitle>
                  <p className="text-primary-foreground/80 text-sm">{mockUser.email}</p>
                </div>
              </div>
            </SheetHeader>
            
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-accent transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border">
                <button
                  onClick={() => {
                    // Handle logout
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-destructive/10 transition-colors text-left text-destructive"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-lg tracking-tight">MulaSense</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-destructive">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h4 className="font-semibold text-sm mb-2">Notifications</h4>
                {mockNotifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        notification.type === 'warning' && "bg-warning",
                        notification.type === 'success' && "bg-success",
                        notification.type === 'info' && "bg-info",
                        notification.type === 'error' && "bg-destructive"
                      )} />
                      <span className="font-medium text-sm">{notification.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">{notification.message}</p>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary text-sm font-medium justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
