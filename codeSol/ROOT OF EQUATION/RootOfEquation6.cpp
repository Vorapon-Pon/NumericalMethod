#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std;

double falsePosition(double xl, double xr, int x, int n, double tolerance);
double function(double value, int n, int x);

int main() {
    int x, n;
    cout << "integer : ";
    cin >> x;
    cout << "root : ";
    cin >> n;

    double xl, xr;
    cout << "assign interval X X : ";
    cin >> xl >> xr;

    double tolerance = 0.00001;

    double root = falsePosition(xl, xr, x, n, tolerance);

    cout << fixed << setprecision(4);
    cout << "root is " << root << endl;

    return 0;
}

double falsePosition(double xl, double xr, int x, int n, double tolerance) {
    double fl,fr;
    double root;

    while (fabs(xr - xl) > tolerance) {
        fl = function(xl, n, x);
        fr = function(xr, n, x);
        root = ((xl * fr) - (xr * fl) )/ (fr - fl); 

        if (fabs(function(root,n,x)) < tolerance) {
            break;
        } else if (function(root,n,x) * fr < 0) {
            xl = root;
        } else {
            xr = root;
        }
    }

    return root;
}

double function(double value, int n, int x) {
    return pow(value, n) - x;
}
