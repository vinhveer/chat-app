import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userIds } = await request.json();
    
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'userIds array is required' },
        { status: 400 }
      );
    }

    const usersResponse = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersResponse.error) {
      console.error('Failed to fetch users:', usersResponse.error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    const usersMap: Record<string, { email: string; displayName: string }> = {};
    
    if (usersResponse.data?.users) {
      usersResponse.data.users.forEach(user => {
        if (userIds.includes(user.id)) {
          const displayName = user.user_metadata?.displayName || 
                            user.raw_user_meta_data?.displayName || 
                            user.email?.split('@')[0] || 'User';
          
          usersMap[user.id] = {
            email: user.email || '',
            displayName: displayName
          };
        }
      });
    }

    return NextResponse.json({ users: usersMap });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
