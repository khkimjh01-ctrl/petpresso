using System;
using System.Drawing;
using System.Windows.Forms;
using Microsoft.Win32;

namespace MatrixScreensaver
{
    public class ConfigForm : Form
    {
        private Label _infoLabel;
        private Label _evangelionLabel;
        private ComboBox _evangelionInterval;
        private Button _okButton;
        private Button _cancelButton;
        private const string RegPath = @"Software\MatrixScreensaver";

        public ConfigForm()
        {
            Text = "매트릭스 화면 보호기 설정";
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            ShowInTaskbar = false;
            StartPosition = FormStartPosition.CenterScreen;
            Size = new Size(420, 280);
            Font = new Font("맑은 고딕", 9);

            _infoLabel = new Label
            {
                AutoSize = false,
                Location = new Point(16, 16),
                Size = new Size(380, 72),
                Text = "대기 시간, 암호 보호 등 일반 화면 보호기 설정은\r\n" +
                       "Windows [설정] → [개인 설정] → [잠금 화면] → [화면 보호기 설정]에서 변경할 수 있습니다.\r\n\r\n" +
                       "아래에서 '에반게리온' 문구가 나타나는 간격만 조정할 수 있습니다.",
                ForeColor = SystemColors.WindowText
            };

            _evangelionLabel = new Label
            {
                Text = "에반게리온 문구 표시 간격:",
                Location = new Point(16, 100),
                AutoSize = true
            };

            _evangelionInterval = new ComboBox
            {
                Location = new Point(16, 122),
                Size = new Size(280, 24),
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            _evangelionInterval.Items.AddRange(new object[]
            {
                "자주 (약 15~30초)",
                "보통 (약 30초~1분)",
                "가끔 (약 1~2분)",
                "드물게 (약 2~3분)"
            });
            _evangelionInterval.SelectedIndex = 1;

            _okButton = new Button
            {
                Text = "확인",
                Location = new Point(216, 200),
                Size = new Size(88, 28),
                DialogResult = DialogResult.OK
            };
            _cancelButton = new Button
            {
                Text = "취소",
                Location = new Point(312, 200),
                Size = new Size(88, 28),
                DialogResult = DialogResult.Cancel
            };

            AcceptButton = _okButton;
            CancelButton = _cancelButton;

            Controls.Add(_infoLabel);
            Controls.Add(_evangelionLabel);
            Controls.Add(_evangelionInterval);
            Controls.Add(_okButton);
            Controls.Add(_cancelButton);

            Load += ConfigForm_Load;
            _okButton.Click += OkButton_Click;
        }

        private void ConfigForm_Load(object sender, EventArgs e)
        {
            try
            {
                using (var key = Registry.CurrentUser.OpenSubKey(RegPath))
                {
                    if (key != null)
                    {
                        var val = key.GetValue("EvangelionInterval");
                        if (val != null && int.TryParse(val.ToString(), out int idx) && idx >= 0 && idx < _evangelionInterval.Items.Count)
                            _evangelionInterval.SelectedIndex = idx;
                    }
                }
            }
            catch { }
        }

        private void OkButton_Click(object sender, EventArgs e)
        {
            try
            {
                using (var key = Registry.CurrentUser.CreateSubKey(RegPath))
                {
                    key?.SetValue("EvangelionInterval", _evangelionInterval.SelectedIndex);
                }
            }
            catch { }
        }
    }
}
