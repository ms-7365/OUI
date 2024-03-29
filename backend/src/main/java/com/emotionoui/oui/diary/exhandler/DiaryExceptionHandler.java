package com.emotionoui.oui.diary.exhandler;

import com.emotionoui.oui.diary.exception.NotExitPrivateDiaryException;
import com.emotionoui.oui.diary.exception.NotFoundPrivateDiaryException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.emotionoui.oui.diary")
public class DiaryExceptionHandler {
    private void makeErrorMessage(StringBuilder errorMessage, Exception e) {
        StackTraceElement[] stackTrace = e.getStackTrace();

        if (stackTrace.length > 0) {
            StackTraceElement topFrame = stackTrace[0];
            String className = topFrame.getClassName();
            String methodName = topFrame.getMethodName();

            errorMessage.append(className).append(".").append(methodName).append(": ");
        }
    }

    @ExceptionHandler(NotExitPrivateDiaryException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> NotExitPrivateDiaryExceptionHandler(NotExitPrivateDiaryException e) {
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("개인 다이어리는 나갈 수 없습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }

    @ExceptionHandler(NotFoundPrivateDiaryException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> NotFoundPrivateDiaryExceptionHandler(NotFoundPrivateDiaryException e) {
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("오늘 개인일기가 작성되지 않았습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }
}