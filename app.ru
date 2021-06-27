require 'rack'
require 'json'
require "highline/import"

# PASS = ask("Enter your password:  ") { |q| q.echo = "x" }
PASS = 'twtwt'

module Html
    def html_for(state)
        %{
            <!DOCTYPE html>
            <html>
                <head>
                    <title>PW Manager</title>
                    <link rel="stylesheet" href="/styles.css">
                    <script>
                    window.secretPassphrase = "#{PASS}";
                    </script>
                    
                    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
                    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
                    <link rel="manifest" href="/favicon/site.webmanifest">
                    <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5">
                    <meta name="msapplication-TileColor" content="#da532c">
                    <meta name="theme-color" content="#ffffff">
                </head>
                <body>
                    <!-- <script src="lib/cryptojs-core.min.js"></script> -->
                    <script src="/lib/crypto.aes.js"></script>
        
                    <!-- <script src="lib/cryptojs-aes.min.js"></script> -->
                    <script src="/main.js"></script>
                    <script>
                    routeTo(#{JSON.generate(state)});
                    </script>
                    <div class="container">
                    </div>
                </body>
            </html>
        }
    end
end



class App
    include Html
    def call(env)
        req = Rack::Request.new(env)
        case req.path_info
        when /^\/$/ # index
            [200, {"Content-Type" => "text/html"}, [html_for({action: 'index'})]]
        when /list/
            dat_files = []
            Dir.glob('./data/*.dat').each do|f|
                dat_files << f
            end
            [200, {"Content-Type" => "application/json"}, [JSON.generate(dat_files)]]
        when /show\/(.*)/
            file_name = sanitize_filename $1

            if env['HTTP_ACCEPT'] && env['HTTP_ACCEPT'] == 'application/json'
                file_content = File.open("./data/#{file_name}.dat").read
                [200, {"Content-Type" => "application/json"}, [JSON.generate({file_content: file_content})]]
            else
                [200, {'Content-Type' => 'text/html'}, [html_for({action: 'show', param: file_name})]]
            end
        when /update/
            posted = JSON.parse env['rack.input'].read
            filename = posted['filename']
            filecontent = posted['encrypteddata']
            # Write to file:
            filepath = "./data/#{sanitize_filename filename}.dat"

            File.write(filepath, filecontent)
            [200, {"Content-Type" => "application/json"}, [JSON.generate({file_path: filepath})]]
        else
            [404, {"Content-Type" => "text/html"}, ["I'm Lost!"]]
        end
    end

    def sanitize_filename(filename)
        filename.gsub(/[^0-9A-z.\-]/, '_')
    end
end


# run app
files = Rack::File.new('public')

run Rack::Cascade.new([files, App.new], [405, 404, 403])
