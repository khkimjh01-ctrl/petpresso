using System;
using System.Windows.Forms;

namespace MatrixScreensaver
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            if (args != null && args.Length > 0)
            {
                string arg = args[0].Trim().ToLowerInvariant();
                if (arg == "/s")
                {
                    Application.Run(new MatrixScreenForm(fullScreen: true));
                    return;
                }
                if (arg == "/p" && args.Length >= 2)
                {
                    if (long.TryParse(args[1].Trim(), out long hwndVal))
                        Application.Run(new MatrixScreenForm(new IntPtr(hwndVal)));
                    return;
                }
                if (arg == "/c" || arg.StartsWith("/c:"))
                {
                    Application.Run(new ConfigForm());
                    return;
                }
                if (arg == "/a")
                {
                    MessageBox.Show(
                        "암호 설정은 Windows 바탕 화면 개인 설정 → 잠금 화면 → 화면 보호기 설정에서 변경할 수 있습니다.",
                        "매트릭스 화면 보호기",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information);
                    return;
                }
            }

            Application.Run(new ConfigForm());
        }
    }
}
