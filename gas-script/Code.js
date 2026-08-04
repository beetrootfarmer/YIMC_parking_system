function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getData') {
    return ContentService.createTextOutput(JSON.stringify(getData()))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reqSheet = ss.getSheetByName('requests');
    const setSheet = ss.getSheetByName('settings');

    if (data.action === 'add') {
      const id = Date.now().toString();
      const timestamp = new Date().toISOString();
      reqSheet.appendRow([id, timestamp, data.course, data.usageTime, data.name, data.carNumber, '대기중']);
      return sendResponse({ success: true, id });
    }

    if (data.action === 'complete') {
      const rows = reqSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(data.id)) {
          reqSheet.getRange(i + 1, 7).setValue('완료');
          break;
        }
      }
      return sendResponse({ success: true });
    }
    if (data.action === 'unrecognized') {
      const rows = reqSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(data.id)) {
          reqSheet.getRange(i + 1, 7).setValue('인식안됨');
          break;
        }
      }
      return sendResponse({ success: true });
    }

    if (data.action === 'delete') {
      const backupSheet = ss.getSheetByName('backup');
      const rows = reqSheet.getDataRange().getValues();
      const deleteAll = data.ids === 'all';
      const targetIds = deleteAll ? null : new Set((data.ids || []).map(String));

      const rowsToBackup = [];
      const rowNumsToDelete = [];
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i][0]) continue;
        if (deleteAll || targetIds.has(String(rows[i][0]))) {
          rowsToBackup.push(rows[i]);
          rowNumsToDelete.push(i + 1);
        }
      }

      if (rowsToBackup.length > 0) {
        if (backupSheet) {
          backupSheet
            .getRange(backupSheet.getLastRow() + 1, 1, rowsToBackup.length, rowsToBackup[0].length)
            .setValues(rowsToBackup);
        }
        rowNumsToDelete
          .sort((a, b) => b - a)
          .forEach((rowNum) => reqSheet.deleteRow(rowNum));
      }

      // ids를 지정했는데 매칭된 행이 하나도 없으면(예: 이전 버전 프런트가 보낸 옛 payload 형식,
      // 이미 삭제된 id 등) 조용히 성공 처리하지 않고 실패로 응답해 프런트가 오류를 인지하게 한다.
      const success = deleteAll || rowsToBackup.length > 0;
      return sendResponse({ success, deletedCount: rowsToBackup.length });
    }

    if (data.action === 'update') {
      const rows = reqSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(data.id)) {
          reqSheet.getRange(i + 1, 3).setValue(data.course);
          reqSheet.getRange(i + 1, 4).setValue(data.usageTime);
          reqSheet.getRange(i + 1, 5).setValue(data.name);
          reqSheet.getRange(i + 1, 6).setValue(data.carNumber);
          break;
        }
      }
      return sendResponse({ success: true });
    }

    if (data.action === 'saveSettings') {
      const coursesStr = data.courses.join(',');
      setSheet.getRange('B1').setValue(coursesStr);
      if (data.tabletPassword) setSheet.getRange('B2').setValue(data.tabletPassword);
      if (data.adminPassword) setSheet.getRange('B3').setValue(data.adminPassword);
      return sendResponse({ success: true });
    }

    return sendResponse({ success: false, message: 'Invalid action' });
  } catch (err) {
    return sendResponse({ success: false, error: err.toString() });
  }
}

function getData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName('requests');
  const setSheet = ss.getSheetByName('settings');

  // 요청 데이터 읽기
  const reqRows = reqSheet.getDataRange().getValues();
  const requests = [];
  for (let i = 1; i < reqRows.length; i++) {
    if (reqRows[i][0]) {
      requests.push({
        id: String(reqRows[i][0]),
        timestamp: reqRows[i][1],
        course: reqRows[i][2],
        usageTime: reqRows[i][3],
        name: reqRows[i][4],
        carNumber: String(reqRows[i][5]),
        status: reqRows[i][6]
      });
    }
  }

  // 설정 데이터 읽기
  const setRows = setSheet.getDataRange().getValues();
  const courses = setRows[0][1] ? String(setRows[0][1]).split(',') : [];
  const tabletPassword = setRows[1][1] ? String(setRows[1][1]) : '0000';
  const adminPassword = setRows[2][1] ? String(setRows[2][1]) : '1234';

  return {
    requests,
    settings: { courses, tabletPassword, adminPassword }
  };
}

function sendResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// backup 시트에서 접수 시각이 1개월 지난 데이터를 삭제한다.
function cleanupOldBackup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const backupSheet = ss.getSheetByName('backup');
  if (!backupSheet) return;

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 1);

  const rows = backupSheet.getDataRange().getValues();
  const rowNumsToDelete = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    const ts = new Date(rows[i][1]);
    if (!isNaN(ts) && ts < cutoff) {
      rowNumsToDelete.push(i + 1);
    }
  }

  rowNumsToDelete.sort((a, b) => b - a).forEach((rowNum) => backupSheet.deleteRow(rowNum));
}

// requests 시트에서 오늘 날짜가 아닌 데이터를 backup으로 옮기고 requests에서 삭제한다.
function archiveStaleRequests() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName('requests');
  const backupSheet = ss.getSheetByName('backup');
  if (!reqSheet || !backupSheet) return;

  const timeZone = ss.getSpreadsheetTimeZone();
  const today = Utilities.formatDate(new Date(), timeZone, 'yyyy-MM-dd');

  const rows = reqSheet.getDataRange().getValues();
  const rowsToBackup = [];
  const rowNumsToDelete = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    const ts = new Date(rows[i][1]);
    if (isNaN(ts)) continue;
    const rowDate = Utilities.formatDate(ts, timeZone, 'yyyy-MM-dd');
    if (rowDate !== today) {
      rowsToBackup.push(rows[i]);
      rowNumsToDelete.push(i + 1);
    }
  }

  if (rowsToBackup.length === 0) return;

  backupSheet
    .getRange(backupSheet.getLastRow() + 1, 1, rowsToBackup.length, rowsToBackup[0].length)
    .setValues(rowsToBackup);
  rowNumsToDelete.sort((a, b) => b - a).forEach((rowNum) => reqSheet.deleteRow(rowNum));
}

// cleanupOldBackup과 archiveStaleRequests는 둘 다 backup 시트를 건드리므로,
// 두 개의 독립된 트리거로 나누면 실행 시각이 겹칠 때 backup 시트에 빈 행이 생기는 등
// 경쟁 상태(race condition)가 생길 수 있다. 하나의 트리거 함수에서 순차 실행해 이를 방지한다.
function dailyMaintenance() {
  cleanupOldBackup();
  archiveStaleRequests();
}

// Apps Script 편집기에서 이 함수를 한 번 실행하면 매일 00시대에
// dailyMaintenance(backup 정리 -> 지난 날짜 requests 이관 순 실행)를 도는 트리거가 등록된다.
function setupDailyTriggers() {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    const fn = trigger.getHandlerFunction();
    if (fn === 'cleanupOldBackup' || fn === 'archiveStaleRequests' || fn === 'dailyMaintenance') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('dailyMaintenance').timeBased().everyDays(1).atHour(0).create();
}