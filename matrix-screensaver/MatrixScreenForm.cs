using System;
using System.Drawing;
using System.Windows.Forms;
using Microsoft.Win32;

namespace MatrixScreensaver
{
    public class MatrixScreenForm : Form
    {
        private readonly bool _fullScreen;
        private readonly IntPtr _previewHandle;
        private readonly System.Windows.Forms.Timer _timer;
        private readonly System.Windows.Forms.Timer _evangelionTimer;
        private readonly string _chars = "ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private float[] _drops;
        private int _columns;
        private float _fontSize = 14f;
        private float _speed = 0.6f;
        private Point _lastMouse = Point.Empty;
        private Label _evangelionLabel;
        private bool _evangelionVisible;
        private Random _rnd = new Random();
        private int _evangelionMinMs = 15000;
        private int _evangelionMaxMs = 45000;

        public MatrixScreenForm(bool fullScreen)
        {
            _fullScreen = fullScreen;
            _previewHandle = IntPtr.Zero;
            FormBorderStyle = FormBorderStyle.None;
            BackColor = Color.Black;
            DoubleBuffered = true;
            StartPosition = FormStartPosition.Manual;
            Location = Point.Empty;
            if (fullScreen)
            {
                Bounds = Screen.PrimaryScreen.Bounds;
                Cursor.Hide();
                KeyDown += (s, e) => Application.Exit();
                MouseMove += OnMouseMoveFullScreen;
            }
            SetupEvangelionLabel();
            _timer = new System.Windows.Forms.Timer { Interval = 33 };
            _timer.Tick += (s, e) => Invalidate();
            _evangelionTimer = new System.Windows.Forms.Timer();
            _evangelionTimer.Tick += EvangelionTimer_Tick;
            Load += MatrixScreenForm_Load;
        }

        public MatrixScreenForm(IntPtr previewHandle)
        {
            _fullScreen = false;
            _previewHandle = previewHandle;
            FormBorderStyle = FormBorderStyle.None;
            BackColor = Color.Black;
            DoubleBuffered = true;
            ShowInTaskbar = false;

            if (previewHandle != IntPtr.Zero)
            {
                HandleCreated += (s, e) => AttachToPreview();
            }
            SetupEvangelionLabel();
            _timer = new System.Windows.Forms.Timer { Interval = 33 };
            _timer.Tick += (s, e) => Invalidate();
            _evangelionTimer = new System.Windows.Forms.Timer();
            _evangelionTimer.Tick += EvangelionTimer_Tick;
            Load += MatrixScreenForm_Load;
        }

        private void SetupEvangelionLabel()
        {
            _evangelionLabel = new Label
            {
                Text = "에반게리온",
                Font = new Font("맑은 고딕", 36, FontStyle.Bold),
                ForeColor = Color.Yellow,
                BackColor = Color.Transparent,
                AutoSize = true,
                Visible = false,
                TabStop = false
            };
            Controls.Add(_evangelionLabel);
        }

        private void AttachToPreview()
        {
            if (_previewHandle == IntPtr.Zero) return;
            try
            {
                NativeMethods.GetClientRect(_previewHandle, out var r);
                int w = r.Right - r.Left;
                int h = r.Bottom - r.Top;
                int style = NativeMethods.GetWindowLong(Handle, NativeMethods.GWL_STYLE);
                NativeMethods.SetWindowLong(Handle, NativeMethods.GWL_STYLE, (style | NativeMethods.WS_CHILD) & ~0x80000000);
                SetBounds(0, 0, w, h);
                NativeMethods.SetParent(Handle, _previewHandle);
            }
            catch { }
        }

        private void MatrixScreenForm_Load(object sender, EventArgs e)
        {
            LoadEvangelionInterval();
            if (_previewHandle != IntPtr.Zero)
                AttachToPreview();
            InitDrops();
            _timer.Start();
            ScheduleEvangelion();
        }

        private void LoadEvangelionInterval()
        {
            try
            {
                using (var key = Registry.CurrentUser.OpenSubKey(@"Software\MatrixScreensaver"))
                {
                    if (key?.GetValue("EvangelionInterval") is object v && int.TryParse(v.ToString(), out int idx))
                    {
                        (_evangelionMinMs, _evangelionMaxMs) = idx switch
                        {
                            0 => (15000, 30000),
                            2 => (60000, 120000),
                            3 => (120000, 180000),
                            _ => (30000, 60000)
                        };
                    }
                }
            }
            catch { }
        }

        private void OnMouseMoveFullScreen(object sender, MouseEventArgs e)
        {
            if (_lastMouse == Point.Empty) _lastMouse = e.Location;
            if (Math.Abs(e.X - _lastMouse.X) > 3 || Math.Abs(e.Y - _lastMouse.Y) > 3)
                Application.Exit();
            _lastMouse = e.Location;
        }

        private void InitDrops()
        {
            int cw = ClientSize.Width > 0 ? ClientSize.Width : 800;
            int ch = ClientSize.Height > 0 ? ClientSize.Height : 600;
            _columns = Math.Max(1, (int)(cw / _fontSize));
            _drops = new float[_columns];
            for (int i = 0; i < _columns; i++)
                _drops[i] = (float)(_rnd.NextDouble() * -80);
        }

        private void ScheduleEvangelion()
        {
            int delay = _evangelionMinMs + _rnd.Next(_evangelionMaxMs - _evangelionMinMs);
            delay = Math.Max(3000, delay);
            _evangelionTimer.Interval = delay;
            _evangelionTimer.Stop();
            _evangelionTimer.Start();
        }

        private void EvangelionTimer_Tick(object sender, EventArgs e)
        {
            _evangelionTimer.Stop();
            if (_evangelionVisible) return;
            _evangelionVisible = true;
            _evangelionLabel.BringToFront();
            _evangelionLabel.Location = new Point(
                (ClientSize.Width - _evangelionLabel.PreferredWidth) / 2,
                (ClientSize.Height - _evangelionLabel.PreferredHeight) / 2);
            _evangelionLabel.Visible = true;
            var hideTimer = new System.Windows.Forms.Timer { Interval = 2500 };
            hideTimer.Tick += (ss, ee) =>
            {
                hideTimer.Stop();
                hideTimer.Dispose();
                _evangelionLabel.Visible = false;
                _evangelionVisible = false;
                ScheduleEvangelion();
            };
            hideTimer.Start();
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            InitDrops();
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            var g = e.Graphics;
            int w = ClientSize.Width;
            int h = ClientSize.Height;
            if (w <= 0 || h <= 0) return;
            if (_drops == null || _drops.Length == 0) InitDrops();

            g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
            g.FillRectangle(Brushes.Black, 0, 0, w, h);
            using (var font = new Font("Consolas", _fontSize))
            using (var brush = new SolidBrush(Color.FromArgb(0, 255, 0)))
            {
                for (int i = 0; i < _drops.Length; i++)
                {
                    char c = _chars[_rnd.Next(_chars.Length)];
                    float x = i * _fontSize;
                    float y = _drops[i] * _fontSize;
                    g.DrawString(c.ToString(), font, brush, x, y);
                    if (y > h && _rnd.NextDouble() > 0.98)
                        _drops[i] = (float)(_rnd.NextDouble() * -20);
                    _drops[i] += _speed;
                }
            }
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            _timer?.Stop();
            _evangelionTimer?.Stop();
            if (_fullScreen) Cursor.Show();
            base.OnFormClosing(e);
        }
    }
}
