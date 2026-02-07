package com.flownic.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String sender;
    private final boolean mailEnabled;
    private final String host;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String sender,
            @Value("${spring.mail.host}") String host,
            @Value("${app.mail.enabled}") boolean mailEnabled
    ) {
        this.mailSender = mailSender;
        this.sender = sender;
        this.host = host;
        this.mailEnabled = mailEnabled;
    }

    public void sendVerificationEmail(String to, String userName, String verifyUrl) {

        // 🔹 DEV SAFETY
        if (!mailEnabled) {
            logger.info("Email disabled. Verification link for {}: {}", to, verifyUrl);
            return;
        }

        if (host == null || host.isBlank() || host.contains("example.com")) {
            logger.warn("SMTP host not configured. Verification link for {}: {}", to, verifyUrl);
            return;
        }

        String safeName = (userName == null || userName.isBlank()) ? "there" : userName;

        // 🔹 TEXT VERSION (fallback)
        String text = """
                Hello %s,

                Thank you for registering with Flownic.ai!

                To complete your registration, please verify your email address using the link below:

                %s

                Best regards,
                Flownic Team

                Note: This verification link is valid for the next 24 hours.
                Need help? Contact our support team at revolixstudio.flownic@gmail.com
                """.formatted(safeName, verifyUrl);

        // 🔹 HTML VERSION (primary)
        String html = """
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1f24;">
                  <p style="margin: 0 0 16px;">Hello %s,</p>

                  <p style="margin: 0 0 16px;">
                    Thank you for registering with <strong>Flownic.ai</strong>!
                  </p>

                  <p style="margin: 0 0 24px;">
                    To complete your registration, please verify your email address by clicking the button below:
                  </p>

                  <p style="margin: 0 0 24px;">
                    <a href="%s"
                       style="display:inline-block;
                              padding:12px 22px;
                              background:#1a7f76;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:6px;
                              font-weight:bold;">
                      Verify Email Address
                    </a>
                  </p>

                  <p style="margin: 0 0 16px;">
                    Best regards,<br/>
                    <strong>Flownic Team</strong>
                  </p>

                  <p style="margin: 0 0 6px;
                            font-size:12px;
                            color:#7a4b00;
                            background:#ffe2b7;
                            display:inline-block;
                            padding:6px 10px;
                            border-radius:6px;">
                    Note: This verification link is valid for the next 24 hours.
                  </p>

                  <p style="margin: 8px 0 0; font-size: 12px; color: #5b6470;">
                    Need help? Contact our support team at
                    <a href="mailto:revolixstudio.flownic@gmail.com">
                      revolixstudio.flownic@gmail.com
                    </a>
                  </p>
                </div>
                """.formatted(safeName, verifyUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject("Verify your email | Flownic.ai");

            // ✅ THIS LINE IS THE KEY FIX
            helper.setText(text, html);

            mailSender.send(message);

        } catch (MessagingException ex) {
            logger.error("Failed to send verification email. Link for {}: {}", to, verifyUrl, ex);
        } catch (RuntimeException ex) {
            logger.error("Unexpected mail error. Link for {}: {}", to, verifyUrl, ex);
        }
    }
}
