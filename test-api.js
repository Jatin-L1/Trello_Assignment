// API Testing Script
const API_URL = 'http://localhost:5000';

async function testEndpoint(method, endpoint, data = null, description) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${description}`);
      return result;
    } else {
      console.log(`❌ ${description} - Error: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing Trello Clone API Endpoints\n');
  console.log('=' .repeat(60));

  // Health Check
  console.log('\n📍 HEALTH CHECK');
  await testEndpoint('GET', '/health', null, 'Health check');

  // Boards
  console.log('\n📋 BOARD ENDPOINTS');
  const boards = await testEndpoint('GET', '/api/boards', null, 'GET /api/boards - Get all boards');
  
  if (boards && boards.data && boards.data.length > 0) {
    const boardId = boards.data[0].id;
    await testEndpoint('GET', `/api/boards/${boardId}`, null, `GET /api/boards/${boardId} - Get board details`);
    
    const newBoard = await testEndpoint('POST', '/api/boards', {
      title: 'Test Board',
      background_color: '#0079bf',
      created_by: '11111111-1111-1111-1111-111111111111'
    }, 'POST /api/boards - Create board');

    if (newBoard && newBoard.data) {
      await testEndpoint('PUT', `/api/boards/${newBoard.data.id}`, {
        title: 'Updated Test Board'
      }, `PUT /api/boards/${newBoard.data.id} - Update board`);

      // Lists
      console.log('\n📝 LIST ENDPOINTS');
      const newList = await testEndpoint('POST', '/api/lists', {
        board_id: newBoard.data.id,
        title: 'Test List'
      }, 'POST /api/lists - Create list');

      if (newList && newList.data) {
        await testEndpoint('PUT', `/api/lists/${newList.data.id}`, {
          title: 'Updated Test List'
        }, `PUT /api/lists/${newList.data.id} - Update list`);

        // Cards
        console.log('\n🎴 CARD ENDPOINTS');
        const newCard = await testEndpoint('POST', '/api/cards', {
          list_id: newList.data.id,
          title: 'Test Card',
          created_by: '11111111-1111-1111-1111-111111111111'
        }, 'POST /api/cards - Create card');

        if (newCard && newCard.data) {
          await testEndpoint('GET', `/api/cards/${newCard.data.id}`, null, `GET /api/cards/${newCard.data.id} - Get card details`);
          
          await testEndpoint('PUT', `/api/cards/${newCard.data.id}`, {
            title: 'Updated Test Card',
            description: 'This is a test description'
          }, `PUT /api/cards/${newCard.data.id} - Update card`);

          await testEndpoint('PUT', `/api/cards/${newCard.data.id}/position`, {
            list_id: newList.data.id,
            position: 0
          }, `PUT /api/cards/${newCard.data.id}/position - Update card position`);

          // Labels
          console.log('\n🏷️  LABEL ENDPOINTS');
          const newLabel = await testEndpoint('POST', '/api/labels', {
            board_id: newBoard.data.id,
            name: 'Test Label',
            color: '#61bd4f'
          }, 'POST /api/labels - Create label');

          if (newLabel && newLabel.data) {
            await testEndpoint('POST', '/api/labels/card', {
              card_id: newCard.data.id,
              label_id: newLabel.data.id
            }, 'POST /api/labels/card - Add label to card');

            await testEndpoint('DELETE', `/api/labels/${newCard.data.id}/${newLabel.data.id}`, null, 'DELETE /api/labels/:card_id/:label_id - Remove label from card');

            await testEndpoint('DELETE', `/api/labels/${newLabel.data.id}`, null, `DELETE /api/labels/${newLabel.data.id} - Delete label`);
          }

          // Checklists
          console.log('\n☑️  CHECKLIST ENDPOINTS');
          const newChecklist = await testEndpoint('POST', '/api/checklists', {
            card_id: newCard.data.id,
            title: 'Test Checklist'
          }, 'POST /api/checklists - Create checklist');

          if (newChecklist && newChecklist.data) {
            const newItem = await testEndpoint('POST', '/api/checklists/items', {
              checklist_id: newChecklist.data.id,
              title: 'Test Item'
            }, 'POST /api/checklists/items - Create checklist item');

            if (newItem && newItem.data) {
              await testEndpoint('PUT', `/api/checklists/items/${newItem.data.id}`, {
                is_completed: true
              }, `PUT /api/checklists/items/${newItem.data.id} - Update checklist item`);

              await testEndpoint('DELETE', `/api/checklists/items/${newItem.data.id}`, null, `DELETE /api/checklists/items/${newItem.data.id} - Delete checklist item`);
            }

            await testEndpoint('DELETE', `/api/checklists/${newChecklist.data.id}`, null, `DELETE /api/checklists/${newChecklist.data.id} - Delete checklist`);
          }

          // Comments
          console.log('\n💬 COMMENT ENDPOINTS');
          const newComment = await testEndpoint('POST', '/api/comments', {
            card_id: newCard.data.id,
            user_id: '11111111-1111-1111-1111-111111111111',
            content: 'Test comment'
          }, 'POST /api/comments - Create comment');

          if (newComment && newComment.data) {
            await testEndpoint('PUT', `/api/comments/${newComment.data.id}`, {
              content: 'Updated test comment'
            }, `PUT /api/comments/${newComment.data.id} - Update comment`);

            await testEndpoint('DELETE', `/api/comments/${newComment.data.id}`, null, `DELETE /api/comments/${newComment.data.id} - Delete comment`);
          }

          // Members
          console.log('\n👥 MEMBER ENDPOINTS');
          await testEndpoint('GET', '/api/members/users', null, 'GET /api/members/users - Get all users');
          
          await testEndpoint('POST', '/api/members/card', {
            card_id: newCard.data.id,
            user_id: '22222222-2222-2222-2222-222222222222'
          }, 'POST /api/members/card - Add member to card');

          await testEndpoint('DELETE', `/api/members/card/${newCard.data.id}/22222222-2222-2222-2222-222222222222`, null, 'DELETE /api/members/card/:card_id/:user_id - Remove member from card');

          // Search
          console.log('\n🔍 SEARCH ENDPOINTS');
          await testEndpoint('GET', `/api/cards/search?board_id=${newBoard.data.id}&query=Test`, null, 'GET /api/cards/search - Search cards');

          // Activities
          console.log('\n📊 ACTIVITY ENDPOINTS');
          await testEndpoint('GET', `/api/activities/board/${newBoard.data.id}`, null, `GET /api/activities/board/${newBoard.data.id} - Get board activities`);

          // Cleanup
          console.log('\n🧹 CLEANUP');
          await testEndpoint('DELETE', `/api/cards/${newCard.data.id}`, null, `DELETE /api/cards/${newCard.data.id} - Delete card`);
        }

        await testEndpoint('DELETE', `/api/lists/${newList.data.id}`, null, `DELETE /api/lists/${newList.data.id} - Delete list`);
      }

      await testEndpoint('DELETE', `/api/boards/${newBoard.data.id}`, null, `DELETE /api/boards/${newBoard.data.id} - Delete board`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ API Testing Complete!\n');
}

// Run tests
runTests().catch(console.error);
